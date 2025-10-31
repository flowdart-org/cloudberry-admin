# CreateTryOnDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**personImage** | [**PersonImage**](PersonImage.md) | Person image input for the virtual try-on model | [default to undefined]
**productImages** | [**Array&lt;ProductImage&gt;**](ProductImage.md) | List of product images to try on | [default to undefined]
**addWatermark** | **boolean** | Whether to add a watermark to the generated image | [optional] [default to undefined]
**baseSteps** | **number** | Base steps for image generation (model parameter) | [optional] [default to undefined]
**personGeneration** | **string** | Type of person generation (e.g., \&quot;REALISTIC\&quot;) | [optional] [default to undefined]
**safetySetting** | **string** | Safety setting for model output | [optional] [default to undefined]
**sampleCount** | **number** | Number of samples to generate | [optional] [default to undefined]
**seed** | **number** | Random seed for reproducibility | [optional] [default to undefined]
**storageUri** | **string** | Cloud Storage URI for saving the generated output | [optional] [default to undefined]
**outputOptions** | **object** | Output options for image format and quality | [optional] [default to undefined]

## Example

```typescript
import { CreateTryOnDto } from './api';

const instance: CreateTryOnDto = {
    personImage,
    productImages,
    addWatermark,
    baseSteps,
    personGeneration,
    safetySetting,
    sampleCount,
    seed,
    storageUri,
    outputOptions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
