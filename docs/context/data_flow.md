This document explains the approach to fetch data data from the backend api and use it in the frontend

There's 4 layers in the approach

UI <- hook <- services <- apiClient

## UI:

This layer is composed by the components that call a hook to get the data to render it.
We perform the fetch as general pattern in the components that actually needs the data, we are granular to fetch the data.
The UI layer mostly lives in the /features/<feature>/components directory but if is a global and reusable component, it lives in /src/components

## hooks

The hook layer implements the react tanstack query approach and call the service layer
By default we apply the useQuery from react tanstack query approach and use suspense approach for managing the loading and error states
We will create a hook for each CRUD operation like useCreateGoals, useGoals, useGoal, useUpdateGoal and useDeleteGoal.
If we apply the suspense approach, it should be called useSuspenseGoal... Mostly used in read operations.
The Hooks layer lives in /feature/<feature>/hooks/ directory

## Service

This layer receives a req object (if needed) to then call the api client
When needed, is in this layer where we will apply transormations or formating to correctly the the request
The service layer lives in /feature/<feature>/services/ directory
The formating function mostly are helpers for that same feature, so they live in /feature/<feature>/helpers/ but if is a shared logic, they can live in /src/helpers/ and there we decide what's the correct place for it
For writting operations, the service layer is responsable for attaching the CSRF token to the request headers
The service layer is the responsable for attaching the abstracted endpoints, queryParams and calling the correct methods.

## apiClient

Is a generic apiClient function that implements all CRUD methods and standarized some patterns