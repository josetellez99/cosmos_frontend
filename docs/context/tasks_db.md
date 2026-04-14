# Cosmos Tasks - Notion Database

Project tasks are tracked in a Notion database called `cosmos_tasks`. This document describes how to connect to and query that database using the Notion MCP tools.

## Database identifiers

| Identifier | Value |
|---|---|
| Database ID | `2ede9b7b-bd75-80fe-9f47-f62f2f6aa55c` |
| Data Source URL | `collection://2ede9b7b-bd75-80a3-a3af-000b2e687558` |

The database lives under the **COSMOS** project page in the Notion workspace.

## Schema

| Property | Type | Values |
|---|---|---|
| **Name** | title | Free text |
| **Status** | status | `Not started`, `In progress`, `Done` |
| **area** | select | `frontend`, `backend`, `full-stack`, `database`, `devops` |
| **priority** | select | `URGENT`, `HIGH`, `MEDIUM`, `LOW` |

## How to access via MCP tools

### 1. Search for tasks

Use `notion-search` with the `data_source_url` to query tasks by keyword:

```json
{
  "query": "<search term>",
  "data_source_url": "collection://2ede9b7b-bd75-80a3-a3af-000b2e687558",
  "filters": {},
  "page_size": 25,
  "max_highlight_length": 0
}
```

### 2. Fetch the full database (schema + views)

Use `notion-fetch` with the database ID to get the schema, data sources, and views:

```json
{
  "id": "2ede9b7b-bd75-80fe-9f47-f62f2f6aa55c"
}
```

### 3. Fetch a single task page

Use `notion-fetch` with the task's page ID (returned in search results as `url`):

```json
{
  "id": "<page-id>"
}
```

The page response includes `properties` (Name, Status, area, priority) and `content` (the page body with details, checklists, notes, etc.).
