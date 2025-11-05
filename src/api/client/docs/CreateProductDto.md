# CreateProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the product | [default to undefined]
**description** | **string** | Description of the product | [default to undefined]
**price** | **number** | Actual price of the product | [default to undefined]
**variants** | [**Array&lt;VariantDto&gt;**](VariantDto.md) | Array of product variants with size and stock | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage of the product | [default to undefined]
**categoryId** | **string** | ID of the category the product belongs to | [default to undefined]
**status** | **string** | Status of the product | [default to undefined]
**tryOn** | **boolean** | Whether the product supports virtual try-on | [default to undefined]
**tags** | **Array&lt;string&gt;** | Array of tags for the product | [optional] [default to undefined]

## Example

```typescript
import { CreateProductDto } from './api';

const instance: CreateProductDto = {
    name,
    description,
    price,
    variants,
    discountPercent,
    categoryId,
    status,
    tryOn,
    tags,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
