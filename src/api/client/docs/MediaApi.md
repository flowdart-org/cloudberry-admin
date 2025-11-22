# MediaApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mediaControllerGetCategoryUploadUrl**](#mediacontrollergetcategoryuploadurl) | **GET** /api/media/upload/category/{categoryId} | |
|[**mediaControllerGetProductThumbnailUploadUrl**](#mediacontrollergetproductthumbnailuploadurl) | **GET** /api/media/upload/product/{productId}/thumbnail | |
|[**mediaControllerGetProductUploadUrl**](#mediacontrollergetproductuploadurl) | **GET** /api/media/upload/product/{productId}/{order} | |
|[**mediaControllerGetUserTryOnUploadUrl**](#mediacontrollergetusertryonuploadurl) | **GET** /api/media/upload/user/try-on | |

# **mediaControllerGetCategoryUploadUrl**
> mediaControllerGetCategoryUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let categoryId: string; // (default to undefined)
let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetCategoryUploadUrl(
    categoryId,
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryId** | [**string**] |  | defaults to undefined|
| **mimeType** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetProductThumbnailUploadUrl**
> mediaControllerGetProductThumbnailUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let productId: string; // (default to undefined)
let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetProductThumbnailUploadUrl(
    productId,
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] |  | defaults to undefined|
| **mimeType** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetProductUploadUrl**
> mediaControllerGetProductUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let productId: string; // (default to undefined)
let order: number; // (default to undefined)
let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetProductUploadUrl(
    productId,
    order,
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] |  | defaults to undefined|
| **order** | [**number**] |  | defaults to undefined|
| **mimeType** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetUserTryOnUploadUrl**
> mediaControllerGetUserTryOnUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetUserTryOnUploadUrl(
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mimeType** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

