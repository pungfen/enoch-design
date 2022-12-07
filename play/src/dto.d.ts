interface EnocloudAdminDefinitions {
  BranchDto: {
    addressCodes: unknown[]
    area?: EnocloudAdminDefinitions['AreaDto']
    cellphone?: string
    children: EnocloudAdminDefinitions['BranchDto'][]
    code?: string
    comment?: string
    creditGrade?: number
    customer?: EnocloudAdminDefinitions['CustomerDto']
    id?: string | number
    name?: string
    parent?: EnocloudAdminDefinitions['BranchDto']
    parentId?: string | number
    root?: EnocloudAdminDefinitions['BranchDto']
    shortName?: string
  }
  'DataResponse«BranchDto»': {
    data: EnocloudAdminDefinitions['BranchDto'][]
  }
}

interface EnocloudAdminActions {
  'GET /enocloud/admin/branch': {
    responses: {
      /** OK */
      200: { schema: EnocloudAdminDefinitions['DataResponse«BranchDto»'] }
      /** Unauthorized */
      401: unknown
      /** Forbidden */
      403: unknown
      /** Not Found */
      404: unknown
    }
  }
}
