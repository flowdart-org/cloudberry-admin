export interface FetchUsersDto {
    page?: number, 
    limit?: number, 
    search?: string, 
    status?: 'active' | 'suspended'
}