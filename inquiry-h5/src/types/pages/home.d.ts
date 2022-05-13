declare namespace HomeModel {
  export interface BannerInfo {
    bannerName: string;
    bannerRedirect: string;
    bannerType: number;
    bannerUrl: string;
    createTime: string;
    createUser: string;
    createUserName: string;
    id: number;
    informationSource: number;
    isDeleted: boolean;
    skipLinkId: number;
    skipLinkName: string;
    skipLinkType: string;
    skipLinkUrl: string;
    sort: number;
    storeId: number;
    storeName: string;
    updateTime: string;
    updateUser: string;
    updateUserName: string;
    weights: number;
  }

  export interface FeedbackList {
    id: number;
    type: string;
  }
  export interface GoodsInfo {
    id: number;
    prodName: string;
    originalPrice: number;
    minPrice: number;
    thumbnail: string;
    dealerThumbnail: string;
    stock: number;
    brandName: string;
    seriesId: number;
    seriesName: string;
    depositType: number;
    depositAmount: number;
    depositDays: number;
    likeFlag: boolean;
    isGroupBuying: number;
    minGuidePrice: number;
    prodSubtitle: string;
    relatedSkuCode: string;
    firstCategoryId: number;
    categoryName: string;
    specsType: number;
    specsValue: string;
  }
  export interface CouponInfo {
    id: number;
    couponName: string;
    couponSubTitle: any;
    couponSource: any;
    couponType: number;
    couponUrl: string;
    couponPath: any;
    couponGrantWay: any;
    buyChannel: any;
    couponOverlayRule: any;
    couponDesc: any;
    useRuleDesc: any;
    auditStatus: any;
    maxAcquirableAmount: any;
    soldAmount: any;
    chargedOffAmount: any;
    usableAmount: number;
    totalAmount: number;
    couponWorth: number;
    discount: number;
    thresholdPrice: number;
    cappingPrice: number;
    buyPrice: number;
    exchangeType: number;
    exchangeBeginTime: any;
    exchangeEndTime: any;
    chargedOffType: any;
    chargedOffBeginTime: any;
    chargedOffEndTime: any;
    chargedOffDay: any;
    showStatus: any;
    weight: number;
    isDeleted: any;
    remark: any;
    createUser: any;
    createUserName: any;
    createTime: any;
    updateUser: any;
    updateUserName: any;
    updateTime: any;
    dealerName: any;
    couponDealerStoreVoList: any;
    hasGrantCouponMax: any;
    couponMembers: any;
    deleted: any;
  }
  export interface FeedbackList {
    id: number;
    type: string;
  }
  export interface CaseItem {
    id: number;
    goodsId: number;
    casePicture: string|string[];
    commentInfo: string;
    isDeleted: any;
    createTime: string;
    updateTime: any;
    statusFlag: number;
    updateUser: any;
    updateUserName: any;
    createUser: any;
    createUserName: any;
    caseType: number;
    brandId: number;
    seriesId?: number;
    firstCategoryId: any;
    secondCategoryId: any;
    thirdCategoryId: any;
    firstCategoryName: any;
    secondCategoryName: any;
    thirdCategoryName: any;
    brandName: string;
    seriesName?: string;
    prodName: string;
    [ket: string]: any;
  }

  export interface ActiveInfo {
    id: number;
    activityName: string;
    activityDesc: string;
    startTime: string;
    endTime: string;
    applyStartTime: string;
    applyEndTime: string;
    activitySite: any;
    openPlace: number;
    virtualApplyNumber: number;
    thumbnail: string;
    isShopDedicated: any;
    isShow: any;
    activityStatus: number;
    applyStatus: number;
    activityWeight: number;
    createTime: any;
    createUser: any;
    createUserName: any;
    updateTime: any;
    updateUser: any;
    updateUserName: any;
    isDeleted: any;
    activityDetails: any;
    dealerNames: any;
    dealerStoreList: any;
    applyTotal: number;
    signStatus: any;
    auditStatus: any;
    memberApplyStatus: any;
  }
}

