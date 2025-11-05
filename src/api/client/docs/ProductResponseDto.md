# ProductResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the product | [default to undefined]
**name** | **string** | Name of the product | [default to undefined]
**description** | **string** | Description of the product | [default to undefined]
**price** | **number** | Actual price of the product | [default to undefined]
**discountPrice** | **number** | Discounted price of the product | [optional] [default to undefined]
**discountPercentage** | **number** | Discount percentage of the product | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** | Array of image URLs for the product | [default to undefined]
**variants** | **Array&lt;string&gt;** | Array of product variants with size and stock information | [default to undefined]
**categoryId** | **string** | Identifier for the category the product belongs to | [default to undefined]
**category** | **object** | Category details of the product | [default to undefined]
**createdAt** | **string** | Timestamp when the product was created | [default to undefined]
**updatedAt** | **string** | Timestamp when the product was last updated | [default to undefined]

## Example

```typescript
import { ProductResponseDto } from './api';

const instance: ProductResponseDto = {
    id,
    name,
    description,
    price,
    discountPrice,
    discountPercentage,
    images,
    variants,
    categoryId,
    category,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
