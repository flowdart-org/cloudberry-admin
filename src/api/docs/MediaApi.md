# MediaApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mediaControllerGetUploadUrl**](#mediacontrollergetuploadurl) | **GET** /api/media/get-upload-url | |

# **mediaControllerGetUploadUrl**
> mediaControllerGetUploadUrl()


### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let fileName: string; // (default to undefined)
let mimeType: string; // (default to undefined)

const { status, data } = await apiInstance.mediaControllerGetUploadUrl(
    fileName,
    mimeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileName** | [**string**] |  | defaults to undefined|
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

