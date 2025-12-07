# OrderResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the order | [default to undefined]
**orderNumber** | **string** | Order number | [default to undefined]
**customer** | [**OrderResponseDtoCustomer**](OrderResponseDtoCustomer.md) |  | [default to undefined]
**placedAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**deliveredAt** | **string** |  | [default to undefined]
**cancelledAt** | **string** |  | [default to undefined]
**subtotal** | **number** |  | [default to undefined]
**shippingCharge** | **number** |  | [default to undefined]
**discount** | **number** |  | [default to undefined]
**total** | **number** |  | [default to undefined]
**items** | [**Array&lt;OrderItemDto&gt;**](OrderItemDto.md) |  | [default to undefined]
**paymentMethod** | **object** |  | [optional] [default to undefined]
**paymentStatus** | **string** |  | [default to undefined]
**orderStatus** | **string** |  | [default to undefined]
**isDeleted** | **boolean** |  | [default to undefined]

## Example

```typescript
import { OrderResponseDto } from './api';

const instance: OrderResponseDto = {
    id,
    orderNumber,
    customer,
    placedAt,
    updatedAt,
    deliveredAt,
    cancelledAt,
    subtotal,
    shippingCharge,
    discount,
    total,
    items,
    paymentMethod,
    paymentStatus,
    orderStatus,
    isDeleted,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
