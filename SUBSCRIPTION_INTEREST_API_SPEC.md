# Subscription Interest API Specification

## Overview
This API endpoint captures user interest for the upcoming subscription service. It collects contact information and preferences to notify users when subscriptions launch.

---

## Endpoint Details

### POST `/api/subscriptions/interest`

**Base URL:** `http://localhost:5000/api` (development) or your production API URL

**Full Endpoint:** `http://localhost:5000/api/subscriptions/interest`

**Purpose:** Capture and store user interest for subscription notifications

**Authentication:** Not required (public endpoint)

**Content-Type:** `application/json`

---

## Request Body

### Schema

```typescript
{
  fullName: string;      // Required - User's full name
  email: string;         // Required - User's email address (must be valid email format)
  phoneNumber?: string;  // Optional - User's phone number
  preferredTier: 'prime' | 'premium' | 'undecided';  // Required - User's tier preference
}
```

### Example Request

```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+234 XXX XXX XXXX",
  "preferredTier": "prime"
}
```

### Field Validation Rules

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `fullName` | string | Yes | - Must not be empty<br>- Trim whitespace<br>- Min length: 2 characters<br>- Max length: 100 characters |
| `email` | string | Yes | - Must be valid email format<br>- Must be unique (no duplicates)<br>- Convert to lowercase<br>- Max length: 255 characters |
| `phoneNumber` | string | No | - If provided, validate phone format<br>- Accept international formats<br>- Max length: 20 characters |
| `preferredTier` | enum | Yes | - Must be one of: 'prime', 'premium', 'undecided'<br>- Default to 'undecided' if invalid |

---

## Response Formats

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Successfully added to subscription waitlist",
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "createdAt": "2025-01-07T12:00:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "fullName": "Full name is required",
    "email": "Invalid email format"
  }
}
```

#### 409 Conflict - Duplicate Email
```json
{
  "success": false,
  "error": "Email already registered",
  "message": "This email is already on the waitlist"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to process request. Please try again later."
}
```

---

## Database Schema

### Table: `subscription_interest` or `subscription_waitlist`

```sql
CREATE TABLE subscription_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  preferred_tier VARCHAR(20) NOT NULL CHECK (preferred_tier IN ('prime', 'premium', 'undecided')),
  source VARCHAR(50) DEFAULT 'manage_page',
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_notified (notified)
);
```

### Field Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `full_name` | VARCHAR(100) | User's full name |
| `email` | VARCHAR(255) | User's email (unique constraint) |
| `phone_number` | VARCHAR(20) | Optional phone number |
| `preferred_tier` | VARCHAR(20) | One of: 'prime', 'premium', 'undecided' |
| `source` | VARCHAR(50) | Source of signup (default: 'manage_page') |
| `notified` | BOOLEAN | Whether user has been notified (default: false) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record last update timestamp |

---

## Business Logic Requirements

### 1. Duplicate Handling
- Check if email already exists before inserting
- If duplicate found, return 409 Conflict
- Consider updating `updated_at` if user resubmits

### 2. Email Normalization
- Convert email to lowercase
- Trim whitespace from all fields
- Validate email format using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### 3. Data Retention
- Store all submissions for marketing purposes
- Flag `notified` when launch email is sent
- Keep records for analytics and reporting

### 4. Optional Features (Nice to Have)
- Send confirmation email to admin when new person joins the waitlist
- Track UTM parameters if available
- Log IP address for fraud prevention
- Rate limiting: Max 5 submissions per IP per hour

---

## Integration Points

### Frontend Integration
- **Service Layer:** `/src/services/subscription.ts`
- **Endpoint:** `POST /api/subscriptions/interest`
- **Component:** `/app/subscriptions/manage/page.tsx`
- **API Utility:** Uses `apiRequest` from `/src/services/api.ts`
- **Base URL:** Configured in `/src/config/index.ts` as `clientConfig.apiBaseUrl`
- **Success Action:** Show success message with toast, display confirmation UI
- **Error Handling:** Display toast notifications with error details

---

## Security Considerations

1. **Input Sanitization**
   - Sanitize all input fields to prevent XSS
   - Validate against SQL injection
   - Limit request size to 1KB

2. **Rate Limiting**
   - Implement rate limiting per IP address
   - Suggested: 5 requests per hour per IP

3. **CORS**
   - Allow only from forvrmurr.com domain
   - Restrict in production environment

4. **Data Privacy**
   - Comply with GDPR/data protection laws
   - Include privacy policy link in form
   - Allow users to unsubscribe/delete data

---

## Testing Checklist

- [ ] Valid submission with all fields
- [ ] Valid submission with only required fields
- [ ] Duplicate email handling
- [ ] Invalid email format
- [ ] Empty required fields
- [ ] SQL injection attempts
- [ ] XSS attempts
- [ ] Rate limiting
- [ ] Phone number validation (various formats)
- [ ] Case sensitivity for email
- [ ] Whitespace handling

---

## Example cURL Request

```bash
curl -X POST https://api.forvrmurr.com/api/subscriptions/interest \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+234 XXX XXX XXXX",
    "preferredTier": "prime"
  }'
```

---

## Analytics & Reporting

### Metrics to Track
1. Total waitlist signups
2. Signups by preferred tier (prime/premium/undecided)
3. Signups over time (daily/weekly)
4. Conversion rate (waitlist → actual subscriber)
5. Geographic distribution (if IP tracking enabled)

### Export Functionality
- Allow admin to export waitlist as CSV
- Include all fields for marketing campaigns
- Filter by tier preference for targeted outreach

---

## Admin Dashboard Requirements (Optional)

### Waitlist Management View
- Display total count of interested users
- Show breakdown by tier preference
- Filter by date range
- Search by email/name
- Export to CSV functionality
- Mark as notified (bulk action)

---

## Migration Path

When subscriptions launch:
1. Send notification emails to all waitlist users
2. Provide exclusive early-bird discount code
3. Track conversion from waitlist to paid subscriber
4. Archive or soft-delete notified records after 30 days

---

## Notes for Backend Developer

- Use transaction for database operations
- Log all submissions for debugging
- Consider using a queue for email confirmations
- Implement idempotency for duplicate submissions
- Add monitoring/alerts for failed submissions
- Consider GDPR compliance for EU users

---

## Frontend Implementation Details

### Service Layer Pattern
The frontend follows a service layer pattern for all API calls:

1. **Service File:** `/src/services/subscription.ts`
   - Contains typed interfaces for request/response
   - Exports `subscriptionService` object with methods
   - Uses the shared `apiRequest` utility

2. **API Configuration:**
   - Base URL: `http://localhost:5000/api` (development)
   - Configured in `/src/config/index.ts`
   - Uses `NEXT_PUBLIC_API_BASE_URL` environment variable

3. **Request Flow:**
   ```
   Component → subscriptionService.submitInterest() 
   → apiRequest() → Backend API
   ```

4. **Error Handling:**
   - Service catches errors and returns typed responses
   - Component displays user-friendly toast notifications
   - Logs errors to console for debugging

### Example Service Usage:
```typescript
import { subscriptionService } from '@/services/subscription';

const response = await subscriptionService.submitInterest({
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+234...",
  preferredTier: "prime"
});
```
