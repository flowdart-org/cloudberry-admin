# MediaApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mediaControllerGetCategoryUploadUrl**](#mediacontrollergetcategoryuploadurl) | **GET** /api/media/upload/category/{categoryId} | |
|[**mediaControllerGetHeroImageUploadUrl**](#mediacontrollergetheroimageuploadurl) | **GET** /api/media/upload/hero-image | |
|[**mediaControllerGetProductThumbnailUploadUrl**](#mediacontrollergetproductthumbnailuploadurl) | **GET** /api/media/upload/product/{productId}/thumbnail | |
|[**mediaControllerGetProductUploadUrl**](#mediacontrollergetproductuploadurl) | **GET** /api/media/upload/product/{productId}/{order} | |
|[**mediaControllerGetUserTryOnUploadUrl**](#mediacontrollergetusertryonuploadurl) | **GET** /api/media/upload/user/try-on | |

# **mediaControllerGetCategoryUploadUrl**
> MediaControllerGetCategoryUploadUrl200Response mediaControllerGetCategoryUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let categoryId: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetCategoryUploadUrl(
    categoryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryId** | [**string**] |  | defaults to undefined|


### Return type

**MediaControllerGetCategoryUploadUrl200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetHeroImageUploadUrl**
> MediaControllerGetCategoryUploadUrl200Response mediaControllerGetHeroImageUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

const { status, data } = await apiInstance.mediaControllerGetHeroImageUploadUrl();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MediaControllerGetCategoryUploadUrl200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetProductThumbnailUploadUrl**
> MediaControllerGetCategoryUploadUrl200Response mediaControllerGetProductThumbnailUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let productId: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetProductThumbnailUploadUrl(
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] |  | defaults to undefined|


### Return type

**MediaControllerGetCategoryUploadUrl200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetProductUploadUrl**
> MediaControllerGetCategoryUploadUrl200Response mediaControllerGetProductUploadUrl()


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

const { status, data } = await apiInstance.mediaControllerGetProductUploadUrl(
    productId,
    order
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] |  | defaults to undefined|
| **order** | [**number**] |  | defaults to undefined|


### Return type

**MediaControllerGetCategoryUploadUrl200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerGetUserTryOnUploadUrl**
> MediaControllerGetCategoryUploadUrl200Response mediaControllerGetUserTryOnUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

const { status, data } = await apiInstance.mediaControllerGetUserTryOnUploadUrl();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MediaControllerGetCategoryUploadUrl200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

