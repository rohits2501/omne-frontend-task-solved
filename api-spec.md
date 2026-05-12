# Pulse API Specification

This document describes the mock API endpoints available via MSW. The mock server runs in the browser — no separate process needed.

Base URL: `/api`

---

## Data Types

### Status Update

```typescript
interface StatusUpdate {
  id: string;                    // UUID
  authorId: string;              // UUID
  authorName: string;            // Display name
  authorAvatar: string;          // URL to avatar image
  teamId: string;                // UUID
  teamName: string;              // Team display name
  project: string;               // Project name
  status: "on_track" | "blocked" | "needs_review" | "done";
  body: string;                  // Update text (1–500 characters)
  blockers: string | null;       // Optional blocker description
  statusDate: string;            // ISO 8601 date (YYYY-MM-DD)
  createdAt: string;             // ISO 8601 datetime
  updatedAt: string;             // ISO 8601 datetime
}
```

### Team

```typescript
interface Team {
  id: string;
  name: string;
  memberCount: number;
}
```

### Team Summary

```typescript
interface TeamSummary {
  totalUpdatesThisWeek: number;
  onTrackCount: number;
  blockedCount: number;
  needsReviewCount: number;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  teamName: string;
  lastUpdate: string | null;     // ISO 8601 datetime, null if no updates
  lastStatus: StatusUpdate["status"] | null;
}
```

---

## Endpoints

### GET /api/statuses

Returns a paginated list of status updates, newest first.

**Query Parameters:**

| Parameter | Type   | Default | Description                        |
|-----------|--------|---------|------------------------------------|
| page      | number | 1       | Page number (1-indexed)            |
| limit     | number | 10      | Items per page (max 50)            |
| status    | string | —       | Filter by status category          |
| team      | string | —       | Filter by team ID                  |
| search    | string | —       | Search in body and author name     |

**Response: 200 OK**

```json
{
  "data": [StatusUpdate],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

---

### GET /api/statuses/:id

Returns a single status update.

**Response: 200 OK**

```json
StatusUpdate
```

**Response: 404 Not Found**

```json
{ "error": "Status not found" }
```

---

### POST /api/statuses

Creates a new status update. The mock server assigns `id`, `authorId`, `authorName`, `authorAvatar`, `createdAt`, and `updatedAt` automatically.

**Request Body:**

```json
{
  "teamId": "string (required)",
  "project": "string (required)",
  "status": "on_track | blocked | needs_review | done (required)",
  "body": "string, 1-500 chars (required)",
  "blockers": "string | null (optional)",
  "statusDate": "YYYY-MM-DD (required)"
}
```

**Response: 201 Created**

```json
StatusUpdate
```

**Response: 400 Bad Request**

```json
{
  "error": "Validation failed",
  "details": {
    "project": "Project is required",
    "body": "Body must be between 1 and 500 characters"
  }
}
```

The `details` object is illustrative, not exhaustive. Depending on the invalid fields, it may also include `status`, `teamId`, and `statusDate`.

---

### PUT /api/statuses/:id

Updates an existing status. This endpoint accepts a partial payload: any subset of the POST fields may be sent, and only provided fields are updated.

**Response: 200 OK**

```json
StatusUpdate
```

**Response: 404 Not Found**

```json
{ "error": "Status not found" }
```

---

### DELETE /api/statuses/:id

Deletes a status update.

**Response: 204 No Content**

*(empty body)*

**Response: 404 Not Found**

```json
{ "error": "Status not found" }
```

---

### GET /api/teams

Returns all teams. This list is static and small — no pagination needed.

**Response: 200 OK**

```json
[Team]
```

---

### GET /api/team-summary

Returns aggregated metrics for the team overview screen.

**Response: 200 OK**

```json
TeamSummary
```

---

## Error Responses

All error responses follow this shape:

```json
{
  "error": "Human-readable error message",
  "details": {}  // Optional, present for validation errors
}
```

Standard HTTP status codes are used: 400 for validation errors, 404 for missing resources, 500 for server errors.

---

## Notes

- The mock server includes a simulated network delay of 200–600ms per request. Your loading states should be visible.
- The mock server will randomly return a 500 error approximately 5% of the time on any endpoint. Your error handling should account for this.
- Pagination is 1-indexed. Requesting a page beyond the total returns an empty `data` array, not an error.
- The `search` parameter does a case-insensitive substring match across `body` and `authorName`.
