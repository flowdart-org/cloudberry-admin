# ProductResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the product | [default to undefined]
**name** | **string** | Name of the product | [default to undefined]
**description** | **string** | Description of the product | [default to undefined]
**price** | **number** | Actual price of the product | [default to undefined]
**discountPrice** | **number** | Discounted price of the product | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage of the product | [optional] [default to undefined]
**thumbnail** | **string** | Product thumbnail URL | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** | Array of image URLs for the product | [default to undefined]
**variants** | **Array&lt;string&gt;** | Array of product variants with size and stock information | [default to undefined]
**categoryId** | **string** | Identifier for the category the product belongs to | [default to undefined]
**category** | **object** | Category details of the product (optional) | [optional] [default to undefined]
**tryOn** | **boolean** | Whether the product supports virtual try-on | [default to undefined]
**status** | **string** | Current product status | [default to undefined]
**createdAt** | **string** | Timestamp when the product was created | [default to undefined]

## Example

```typescript
import { ProductResponseDto } from './api';

const instance: ProductResponseDto = {
    id,
    name,
    description,
    price,
    discountPrice,
    discountPercent,
    thumbnail,
    images,
    variants,
    categoryId,
    category,
    tryOn,
    status,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
