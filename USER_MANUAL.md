# Agency ERP User Manual

Welcome to the **Agency ERP**, a centralized tracking and management system designed for digital marketing agencies. This manual will guide you through the features and modules available in the application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Content Calendar Tracker](#content-calendar-tracker)
4. [Clients Module](#clients-module)
5. [Deliverables Module](#deliverables-module)
6. [Job Tracker Module](#job-tracker-module)
7. [Employees Module](#employees-module)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Login
1. Navigate to the Agency ERP website.
2. If this is your first time, an Administrator must invite you or manually create your account in Supabase. 
3. Log in using your registered **Email Address** and **Password**.

> [!NOTE]
> Sessions will remain active automatically for a predetermined period. Use the Logout button from the Sidebar when stepping away.

---

## Dashboard

The **Dashboard** gives you a high-level overview of the health of your agency operations. 

- **Key Performance Indicators (KPIs):** View total active clients, content items completed vs. pending, and active employees.
- **Visual Analytics:** Find visual charts that summarize the distribution of deliverables and statuses of daily content across platforms.

---

## Content Calendar Tracker

The Calendar and Tracking module is where the team spends most of its day-to-day operations. It operates in multiple views via Tabs:

1. **Daily View:** Track daily activities for specific deliverables. You can view the status of Content Writing, Creative Development, Client Approvals, and Posting at a glance.
2. **Deliverables Split:** Observe exactly how many Reels, Posts, and YouTube videos are tracked on a per-platform basis.
3. **Job Work Split:** Review specific tasks assigned across the agency. 
4. **Client Details & Content Status:** Switch over to see how far along particular clients are in the cycle.

*Actions:* 
- Use the status dropdowns on individual rows to update the lifecycle stage of a piece of content. Changes are directly saved to the database.

---

## Clients Module

Manage your roster of agency clients.

- **Viewing:** View all clients in an organized card layout. 
- **Adding a Client:** Click the "Add Client" button to bring up a modal to input Name, Industry, Brand tone, and contact details.
- **Client Details Page:** By clicking a client, you enter the dedicated client page where you can manage `Deliverables` and `Content details` closely tied to that specific client.

---

## Deliverables Module

Deliverables are the structural representations of content you owe to your clients (e.g., A specific Post, Reel, or Short).

- Create new Deliverables tied to a specific Client. 
- Define the `Type` (e.g., Post, Reel) and `Platform` (e.g., Instagram, YouTube).
- Add specific `Notes` and reference links.

---

## Job Tracker Module

This module is specific for managing the internal workload allocation across employees.

- Assign `Deliverables` to a specific `Employee`. 
- Specify the `Task Type` (e.g., Video Editing, Copywriting).
- Check the box if a job is in the "Correction" loop.
- Track current status (e.g., Pending, In Progress, Completed).

---

## Employees Module

Keep an internal directory of agency staff to ensure seamless resource allocation. 

- Add new team members via the "Add Employee" button.
- Maintain fields like Employee ID, Name, Role, Department, and Email.
- Staff members added here map directly to the assignee dropdowns in the Job Tracker module.

---

## Troubleshooting

### Q: Why can't I see new clients or deliverables I just added?
**A:** Make sure you are logged in correctly, and refresh the page. Next.js uses caching to improve speed, but typically the UI should update seamlessly. If you are continually failing to fetch, your session token may be invalid, try logging out and logging back in.

### Q: Some graphics or fonts are displaying incorrectly?
**A:** Please use a modern web browser. Google Chrome, Microsoft Edge, and Apple Safari tend to provide the best native capabilities needed for the application runtime. 

### Q: I'm not able to submit a form (the 'Save' button is greyed out)?
**A:** Ensure all required fields (often marked with an asterisk `*`) are adequately filled. Double-check your spelling or email address fields.

_For further support, please contact your internal IT administrator or system deployer._
