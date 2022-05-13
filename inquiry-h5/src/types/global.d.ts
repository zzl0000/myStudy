declare const __wxConfig: any
// declare const uview-ui: any;
declare interface StoreVo {
  id?: number
  storeName?: string
  dealerId?: number
  brandId?: number
  csPhone?: string
  provinceName?: string
  cityName?: string
  areaName?: string
  storeAddress?: string
  storeAddressDetail?: string
  storeCoordinate?: string
  storeStatus?: number
  createUser?: string
  createUserName?: string
  createTime?: string
  updateUser?: string
  updateUserName?: string
  updateTime?: string
  isDeleted?: boolean
  startTime?: any
  endTime?: any
  storeDist?: string
}

declare interface PagingInfo<T> {
  pageNum?: number
  hasNextPage?: boolean
  pageSize?: number
  totalPages?: number
  totalRecords?: number
  records?: T[]
  casePage?: string
}

declare interface DesignDetail {
  [x: string]: any
  arg0: (v: any) => void
  epId: number
  orderBy: string
  pageNum: number
  pageSize: number
  returnFields: string
  storeId: number
  stylistId: number
  stylistName: string
}

interface ConstructionStageLog {
  id: number
  avatar: string
  itemId: number
  stage: number
  imgUrl?: string
  vrUrl?: string
  stageDescribe?: string
  createBy: number
  createTime: string
  updateBy?: number
  updateTime?: string
  salesManName: any
  salesManAvatar: any
  employeeName: string
  imgUrls?: string[]
}

declare interface CaseDetail {
  [x: string]: any
  bedRoomNum: number
  caseAddress: string
  caseAddressDetail: string
  caseArea: number
  caseBudget: number
  caseCoordinate: string
  caseDetail: string
  caseName?: string
  casePage: string
  caseStyle: number
  caseStyleDesc: string
  caseType: number
  caseVr: string
  caseWay: number
  caseWayDesc: string
  dealerId: number
  epId: number
  favorite: boolean
  id: number
  kitchenNum: number
  liveRoomNum: number
  roomDesc: string
  toiletNum: number
  imgUrl: string
  residentialAddress: string
  detailsAddress: string
  stage: number
  itemName: string
  likeFlag: boolean
  constructionStageLogs: ConstructionStageLog[]
  currentConstruction: string[]
  data: any
}
