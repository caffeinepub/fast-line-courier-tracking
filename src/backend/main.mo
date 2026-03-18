import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Shipment Core Types and State
  type TimelineEvent = {
    date : Text;
    event : Text;
    location : Text;
  };

  type Shipment = {
    shippingCost : Text;
    handlingFee : Text;
    trackingNumber : Text;
    status : Text;
    senderName : Text;
    senderAddress : Text;
    recipientName : Text;
    recipientAddress : Text;
    recipientPhone : Text;
    origin : Text;
    destination : Text;
    weight : Text;
    serviceType : Text;
    estimatedDelivery : Text;
    createdAt : Time.Time;
    timeline : [TimelineEvent];
  };

  type TimelineEventInput = {
    date : Text;
    event : Text;
    location : Text;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // First admin claim flag
  var firstAdminClaimed : Bool = false;

  // Shipments state
  let shipments = Map.empty<Text, Shipment>();

  // User profiles state
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Shipment {
    /// Compare two shipments by oldest to newest.
    public func compareByOldestToNewest(shipment1 : Shipment, shipment2 : Shipment) : Order.Order {
      compareByOldestToNewestByTimeline(shipment1.timeline, shipment2.timeline);
    };

    /// Compare two arrays of timeline events by oldest to newest.
    func compareByOldestToNewestByTimeline(timeline1 : [TimelineEvent], timeline2 : [TimelineEvent]) : Order.Order {
      switch (Text.compare(getOldestEventDate(timeline1), getOldestEventDate(timeline2))) {
        case (#equal) { compareByNewestToOldestByTimeline(timeline1, timeline2) };
        case (order) { order };
      };
    };

    /// Compare two timelines by newest to oldest.
    func compareByNewestToOldestByTimeline(timeline1 : [TimelineEvent], timeline2 : [TimelineEvent]) : Order.Order {
      Text.compare(getNewestEventDate(timeline1), getNewestEventDate(timeline2));
    };

    func getOldestEventDate(timeline : [TimelineEvent]) : Text {
      var oldestDate = "9999-12-31"; // Arbitrary high value
      for (event in timeline.values()) {
        if (Text.compare(event.date, oldestDate) == #less) {
          oldestDate := event.date;
        };
      };
      oldestDate;
    };

    func getNewestEventDate(timeline : [TimelineEvent]) : Text {
      var newestDate = "0000-01-01"; // Arbitrary low value
      for (event in timeline.values()) {
        if (Text.compare(event.date, newestDate) == #greater) {
          newestDate := event.date;
        };
      };
      newestDate;
    };

    /// Compare two Shipments by recipient names lexicographically
    func compareByRecipientName(shipment1 : Shipment, shipment2 : Shipment) : Order.Order {
      Text.compare(shipment1.recipientName, shipment2.recipientName);
    };
  };

  // First-time admin setup: allows the first user to claim admin if no admin exists yet
  public shared ({ caller }) func claimFirstAdmin() : async () {
    if (firstAdminClaimed) {
      Runtime.trap("Admin already exists. This setup has already been completed.");
    };
    if (caller.isAnonymous()) {
      Runtime.trap("Must be logged in with Internet Identity to claim admin.");
    };
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    firstAdminClaimed := true;
  };

  // Check if first admin has been claimed
  public query func isFirstAdminClaimed() : async Bool {
    firstAdminClaimed;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin functions
  public shared ({ caller }) func createShipment(
    trackingNumber : Text,
    senderName : Text,
    senderAddress : Text,
    recipientName : Text,
    recipientAddress : Text,
    recipientPhone : Text,
    origin : Text,
    destination : Text,
    weight : Text,
    serviceType : Text,
    estimatedDelivery : Text,
    shippingCost : Text,
    handlingFee : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create shipments");
    };
    let shipment : Shipment = {
      trackingNumber;
      status = "Order Placed";
      senderName;
      senderAddress;
      recipientName;
      recipientAddress;
      recipientPhone;
      origin;
      destination;
      weight;
      serviceType;
      estimatedDelivery;
      createdAt = Time.now();
      timeline = [];
      shippingCost;
      handlingFee;
    };
    shipments.add(trackingNumber, shipment);
  };

  public shared ({ caller }) func updateShipmentStatus(trackingNumber : Text, status : Text, event : TimelineEventInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update shipments");
    };
    let shipment = switch (shipments.get(trackingNumber)) {
      case (null) { Runtime.trap("Shipment not found") };
      case (?shipment) { shipment };
    };
    let newEvent : TimelineEvent = {
      date = event.date;
      event = event.event;
      location = event.location;
    };
    let updatedTimeline = List.fromArray<TimelineEvent>(shipment.timeline);
    updatedTimeline.add(newEvent);
    let updatedShipment : Shipment = {
      trackingNumber = shipment.trackingNumber;
      status;
      senderName = shipment.senderName;
      senderAddress = shipment.senderAddress;
      recipientName = shipment.recipientName;
      recipientAddress = shipment.recipientAddress;
      recipientPhone = shipment.recipientPhone;
      origin = shipment.origin;
      destination = shipment.destination;
      weight = shipment.weight;
      serviceType = shipment.serviceType;
      estimatedDelivery = shipment.estimatedDelivery;
      createdAt = shipment.createdAt;
      timeline = updatedTimeline.toArray();
      shippingCost = shipment.shippingCost;
      handlingFee = shipment.handlingFee;
    };
    shipments.add(trackingNumber, updatedShipment);
  };

  public shared ({ caller }) func deleteShipment(trackingNumber : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete shipments");
    };
    shipments.remove(trackingNumber);
  };

  // Public functions
  public query ({ caller }) func getShipment(trackingNumber : Text) : async ?Shipment {
    shipments.get(trackingNumber);
  };

  public query ({ caller }) func getAllShipments() : async [Shipment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access all shipments");
    };
    shipments.values().toArray().sort(Shipment.compareByOldestToNewest);
  };

  public query ({ caller }) func getShipmentsByStatus(status : Text) : async [Shipment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this data");
    };
    let filteredShipments = List.empty<Shipment>();
    for ((trackingNumber, shipment) in shipments.entries()) {
      if (Text.equal(shipment.status, status)) {
        filteredShipments.add(shipment);
      };
    };
    filteredShipments.toArray();
  };
};
