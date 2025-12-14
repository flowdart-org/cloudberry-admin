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
**tryOnImage** | **object** | URL of the user try-on image | [default to undefined]
**tryOnLimit** | **number** | URL of the user try-on image | [default to undefined]
**addresses** | [**Array&lt;AddressResponseDto&gt;**](AddressResponseDto.md) | List of user addresses | [default to undefined]
**status** | **string** | Current status of the user account | [default to undefined]
**joined** | **string** | Account creation timestamp | [default to undefined]

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
    tryOnImage,
    tryOnLimit,
    addresses,
    status,
    joined,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
