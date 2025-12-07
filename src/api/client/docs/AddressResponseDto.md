# AddressResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique ID of the address | [default to undefined]
**isPrimary** | **boolean** | Whether this is the primary address | [default to undefined]
**houseNo** | **string** | House or flat number | [optional] [default to undefined]
**street** | **string** | Street name | [optional] [default to undefined]
**city** | **string** | City name | [optional] [default to undefined]
**state** | **string** | State or region name | [optional] [default to undefined]
**country** | **string** | Country name | [optional] [default to undefined]
**pincode** | **string** | Postal/ZIP code | [optional] [default to undefined]

## Example

```typescript
import { AddressResponseDto } from './api';

const instance: AddressResponseDto = {
    id,
    isPrimary,
    houseNo,
    street,
    city,
    state,
    country,
    pincode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
