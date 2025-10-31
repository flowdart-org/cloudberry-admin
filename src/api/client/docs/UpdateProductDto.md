# UpdateProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the product | [optional] [default to undefined]
**description** | **string** | Description of the product | [optional] [default to undefined]
**actualPrice** | **number** | Actual price of the product | [optional] [default to undefined]
**variants** | [**Array&lt;VariantDto&gt;**](VariantDto.md) | Array of product variants with size and stock | [optional] [default to undefined]
**discountPrice** | **number** | Discounted price of the product | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage of the product | [optional] [default to undefined]
**categoryId** | **number** | ID of the category the product belongs to | [optional] [default to undefined]
**status** | **string** | Status of the product | [optional] [default to undefined]
**tryOn** | **boolean** | Whether the product supports virtual try-on | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | Array of tags for the product | [optional] [default to undefined]
**id** | **string** | ID of the product to update | [default to undefined]

## Example

```typescript
import { UpdateProductDto } from './api';

const instance: UpdateProductDto = {
    name,
    description,
    actualPrice,
    variants,
    discountPrice,
    discountPercent,
    categoryId,
    status,
    tryOn,
    tags,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
