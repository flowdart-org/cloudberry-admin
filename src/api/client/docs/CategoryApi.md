# CategoryApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**categoryControllerCreate**](#categorycontrollercreate) | **POST** /api/category | |
|[**categoryControllerFindAll**](#categorycontrollerfindall) | **GET** /api/category | |
|[**categoryControllerFindOne**](#categorycontrollerfindone) | **GET** /api/category/{id} | |
|[**categoryControllerUpdate**](#categorycontrollerupdate) | **PATCH** /api/category/{id} | |

# **categoryControllerCreate**
> categoryControllerCreate(createCategoryDto)


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    CreateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let createCategoryDto: CreateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerCreate(
    createCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCategoryDto** | **CreateCategoryDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerFindAll**
> categoryControllerFindAll()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

const { status, data } = await apiInstance.categoryControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


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

# **categoryControllerFindOne**
> categoryControllerFindOne()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.categoryControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **categoryControllerUpdate**
> categoryControllerUpdate(updateCategoryDto)


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    UpdateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: string; // (default to undefined)
let updateCategoryDto: UpdateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerUpdate(
    id,
    updateCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCategoryDto** | **UpdateCategoryDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

