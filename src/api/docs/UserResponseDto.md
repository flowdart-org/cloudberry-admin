# UserResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the user | [default to undefined]
**name** | **string** | Full name of the user | [optional] [default to undefined]
**email** | **string** | Email address of the user | [optional] [default to undefined]
**phone** | **string** | Phone number of the user | [optional] [default to undefined]
**dob** | **string** | Date of birth of the user | [optional] [default to undefined]
**gender** | **string** | Gender of the user | [optional] [default to undefined]
**status** | **string** | Current status of the user account | [default to undefined]
**createdAt** | **string** | Account creation timestamp | [default to undefined]
**updatedAt** | **string** | Last account update timestamp | [default to undefined]

## Example

```typescript
import { UserResponseDto } from './api';

const instance: UserResponseDto = {
    id,
    name,
    email,
    phone,
    dob,
    gender,
    status,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
