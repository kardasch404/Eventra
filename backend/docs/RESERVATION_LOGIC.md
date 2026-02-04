# Reservation Logic Flowchart

## Create Reservation Flow

```
START
  ↓
Get Event by ID
  ↓
Event exists? ──NO──> Error: "Event not found"
  ↓ YES
Event status = PUBLISHED? ──NO──> Error: "Event is not published"
  ↓ YES
Event status ≠ CANCELED? ──NO──> Error: "Event is canceled"
  ↓ YES
bookedCount + quantity ≤ capacity? ──NO──> Error: "Event is full"
  ↓ YES
Get User Reservations
  ↓
Has active reservation for event? ──YES──> Error: "User already has active reservation"
  ↓ NO
Generate UUID v7
  ↓
Generate Ticket Code (TKT-{timestamp}-{random})
  ↓
Create Reservation (status: PENDING)
  ↓
Increment Event bookedCount
  ↓
Save Reservation
  ↓
RETURN Reservation
```

## Confirm Reservation Flow

```
START
  ↓
Get Reservation by ID
  ↓
Reservation exists? ──NO──> Error: "Reservation not found"
  ↓ YES
Reservation status = PENDING? ──NO──> Error: "Only pending reservations can be confirmed"
  ↓ YES
Update status to CONFIRMED
  ↓
Set confirmedAt timestamp
  ↓
Save Reservation
  ↓
RETURN Updated Reservation
```

## Refuse Reservation Flow

```
START
  ↓
Get Reservation by ID
  ↓
Reservation exists? ──NO──> Error: "Reservation not found"
  ↓ YES
Reservation status = PENDING? ──NO──> Error: "Only pending reservations can be refused"
  ↓ YES
Update status to REFUSED
  ↓
Decrement Event bookedCount by quantity
  ↓
Save Reservation
  ↓
RETURN Updated Reservation
```

## Cancel Reservation Flow (with Permission Check)

```
START
  ↓
Get Reservation by ID
  ↓
Reservation exists? ──NO──> Error: "Reservation not found"
  ↓ YES
Reservation.userId = Current User ID? ──NO──> Error: "Reservation does not belong to user"
  ↓ YES
Reservation can be canceled? ──NO──> Error: "Reservation cannot be canceled"
(status = PENDING or CONFIRMED)
  ↓ YES
Get User by ID
  ↓
User exists? ──NO──> Error: "User not found"
  ↓ YES
Check Permission: "reservation:cancel"
  ↓
Loop through User.roles
  ↓
Loop through Role.permissions
  ↓
Permission.slug = "reservation:cancel"? ──NO──> Error: "No permission to cancel"
  ↓ YES
Update status to CANCELED
  ↓
Set canceledAt timestamp
  ↓
Decrement Event bookedCount by quantity
  ↓
Save Reservation
  ↓
RETURN Updated Reservation
```

## Get My Reservations Flow

```
START
  ↓
Get Reservations by User ID
  ↓
RETURN List of Reservations
```

## Reservation Status State Machine

```
         CREATE
           ↓
       [PENDING]
         ↙   ↘
    CONFIRM  REFUSE
       ↓       ↓
  [CONFIRMED] [REFUSED]
       ↓
    CANCEL
       ↓
   [CANCELED]
```

## Validation Rules

### Create Reservation
1. ✅ Event must exist
2. ✅ Event status must be PUBLISHED
3. ✅ Event status must not be CANCELED
4. ✅ Event must have available capacity (bookedCount + quantity ≤ capacity)
5. ✅ User must not have an active reservation (PENDING or CONFIRMED) for the same event

### Confirm Reservation
1. ✅ Reservation must exist
2. ✅ Reservation status must be PENDING

### Refuse Reservation
1. ✅ Reservation must exist
2. ✅ Reservation status must be PENDING
3. ✅ Decrement event bookedCount

### Cancel Reservation
1. ✅ Reservation must exist
2. ✅ Reservation must belong to the user
3. ✅ Reservation status must be PENDING or CONFIRMED
4. ✅ User must have "reservation:cancel" permission
5. ✅ Decrement event bookedCount

### Get My Reservations
1. ✅ Return all reservations for the authenticated user

## Ticket Code Format

```
TKT-{timestamp}-{random}

Example: TKT-1701234567890-A3B5C7
```

- `TKT`: Prefix
- `{timestamp}`: Current timestamp in milliseconds
- `{random}`: 6-character random alphanumeric string (uppercase)

## Event Capacity Management

### When Reservation is Created (PENDING)
- ✅ Increment event.bookedCount by reservation.quantity

### When Reservation is Confirmed
- ❌ No change to event.bookedCount (already counted when created)

### When Reservation is Refused
- ✅ Decrement event.bookedCount by reservation.quantity

### When Reservation is Canceled
- ✅ Decrement event.bookedCount by reservation.quantity

## Permission System (Future Implementation)

The cancel reservation use case includes a permission check placeholder:

```typescript
private checkCancelPermission(): boolean {
  // TODO: Implement actual permission checking
  // Loop through user.roles
  // Loop through role.permissions
  // Check if permission.slug === 'reservation:cancel'
  return true; // Currently allows all users
}
```

This will be fully implemented when the Role and Permission entities are integrated with the User entity.
