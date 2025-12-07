# CartItemResponseDtoProduct

Details of the product in the cart item

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**thumbnail** | **string** |  | [optional] [default to undefined]
**category** | [**CartResponseDtoItemsInnerProductCategory**](CartResponseDtoItemsInnerProductCategory.md) |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { CartItemResponseDtoProduct } from './api';

const instance: CartItemResponseDtoProduct = {
    id,
    name,
    description,
    price,
    thumbnail,
    category,
    images,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
