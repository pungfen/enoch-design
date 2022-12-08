export {}

declare global {
  interface Definitions extends EnocloudAdminDefinitions {}
  interface Definitions extends EnocloudAnalysisDefinitions {}
  interface Definitions extends EnocloudBusinessOpportunityDefinitions {}
  interface Definitions extends EnocloudCloudDefinitions {}
  interface Definitions extends EnocloudCommonDefinitions {}
  interface Definitions extends EnocloudCustomerServiceDefinitions {}
  interface Definitions extends EnocloudDashboardDefinitions {}
  interface Definitions extends EnocloudInventoryDefinitions {}
  interface Definitions extends EnocloudMallDefinitions {}
  interface Definitions extends EnocloudManufacturingDefinitions {}
  interface Definitions extends EnocloudMembershipDefinitions {}
  interface Definitions extends EnocloudOpenDefinitions {}
  interface Definitions extends EnocloudQueryDefinitions {}
  interface Definitions extends EnocloudSecurityDefinitions {}
  interface Definitions extends EnocloudServiceDefinitions {}
  interface Definitions extends EnocloudSettlementDefinitions {}
  interface Definitions extends EnocloudShortMessageDefinitions {}
  interface Definitions extends EnocloudStatementDefinitions {}
  interface Definitions extends EnocloudSupplierDefinitions {}
  interface Definitions extends EnocloudWechatbDefinitions {}
  interface Definitions extends EnocloudWechatcDefinitions {}
  interface Definitions extends EnocloudWechatmDefinitions {}

  interface AjaxActions extends EnocloudAdminActions {}
  interface AjaxActions extends EnocloudAnalysisActions {}
  interface AjaxActions extends EnocloudBusinessOpportunityActions {}
  interface AjaxActions extends EnocloudCloudActions {}
  interface AjaxActions extends EnocloudCommonActions {}
  interface AjaxActions extends EnocloudCustomerServiceActions {}
  interface AjaxActions extends EnocloudDashboardActions {}
  interface AjaxActions extends EnocloudInventoryActions {}
  interface AjaxActions extends EnocloudMallActions {}
  interface AjaxActions extends EnocloudManufacturingActions {}
  interface AjaxActions extends EnocloudMembershipActions {}
  interface AjaxActions extends EnocloudOpenActions {}
  interface AjaxActions extends EnocloudQueryActions {}
  interface AjaxActions extends EnocloudSecurityActions {}
  interface AjaxActions extends EnocloudServiceActions {}
  interface AjaxActions extends EnocloudSettlementActions {}
  interface AjaxActions extends EnocloudShortMessageActions {}
  interface AjaxActions extends EnocloudStatementActions {}
  interface AjaxActions extends EnocloudSupplierActions {}
  interface AjaxActions extends EnocloudWechatbActions {}
  interface AjaxActions extends EnocloudWechatcActions {}
  interface AjaxActions extends EnocloudWechatmActions {}
}

declare module '@enochfe/factory' {
  interface FactoryAjaxActions extends AjaxActions {}
}
