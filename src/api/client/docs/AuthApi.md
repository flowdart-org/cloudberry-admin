# AuthApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerAdminLogin**](#authcontrolleradminlogin) | **POST** /api/auth/admin/login | Admin login with email and password.|
|[**authControllerLogout**](#authcontrollerlogout) | **POST** /api/auth/logout | Logout user removes token from cookies.|
|[**authControllerRefreshToken**](#authcontrollerrefreshtoken) | **POST** /api/auth/refresh-token | Refresh access and refresh tokens.|
|[**authControllerRequestOtp**](#authcontrollerrequestotp) | **POST** /api/auth/login/request-otp | Request OTP for user.|
|[**authControllerVerifyOtp**](#authcontrollerverifyotp) | **POST** /api/auth/login | Verify the OTP of the user.|

# **authControllerAdminLogin**
> AuthControllerRequestOtp200Response authControllerAdminLogin(adminLoginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AdminLoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let adminLoginDto: AdminLoginDto; //

const { status, data } = await apiInstance.authControllerAdminLogin(
    adminLoginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminLoginDto** | **AdminLoginDto**|  | |


### Return type

**AuthControllerRequestOtp200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogout**
> authControllerLogout()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerLogout();
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
|**200** | User logged out successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshToken**
> authControllerRefreshToken()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerRefreshToken();
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
|**200** | Tokens refreshed successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRequestOtp**
> AuthControllerRequestOtp200Response authControllerRequestOtp(loginRequestOTPDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginRequestOTPDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginRequestOTPDto: LoginRequestOTPDto; //

const { status, data } = await apiInstance.authControllerRequestOtp(
    loginRequestOTPDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequestOTPDto** | **LoginRequestOTPDto**|  | |


### Return type

**AuthControllerRequestOtp200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OTP has successfully sent. |  -  |
|**400** | Validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyOtp**
> authControllerVerifyOtp(loginVerifyOTPDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginVerifyOTPDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginVerifyOTPDto: LoginVerifyOTPDto; //

const { status, data } = await apiInstance.authControllerVerifyOtp(
    loginVerifyOTPDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginVerifyOTPDto** | **LoginVerifyOTPDto**|  | |


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
|**200** | OTP verified |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

