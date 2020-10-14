export class InvoiceDetails {

    // InvoiceId: string;
    InvNo: string;
    Version: string;
    UserGstin: string;
    Typ: string;
    No: string;
    Dt: string;
    OrgInvNo: string;
    AckNo: string;
    AckDt: string;
    Irn: string;
    SignedInvoice: string;
    SignedQRCode: string;
    // Status: string;
    StatusDescription: string;
    InvPdf: string;
    InvQRPdf: string;

    // public string DocumentType { get; set; }
    //     public string Type { get; set; }
    //     public string InvoiceNumber { get; set; }
    //     public string InvoiceDate { get; set; }
    //     public string Customer { get; set; }
    //     public string Plant { get; set; }
    //     public string IRN { get; set; }
    //     public string IRNDate { get; set; }
    //     public string IRNTime { get; set; }
    //     public string ACKNumber { get; set; }

    InvoiceID:number;
    DocumentType: string;
    Type: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    Customer: string;
    Plant: string;
    IRN: string;
    IRNDate: string;
    IRNTime: string;
    ACKNumber: string;
    Status:string;
    // VEHICLE_CAPACITY: string;
    // FWD_AGENT: string;
    // CARRIER: string;
    // EWAYBILL_NO: string;
    // EWAYBILL_DATE: string;
    // OUTBOUND_DELIVERY: string;
    // OUTBOUND_DELIVERY_DATE: string;
    // FREIGHT_ORDER: string;
    // FREIGHT_ORDER_DATE: string;
    // ACTUAL_DISPATCH_DATE: string;
    // PROPOSED_DELIVERY_DATE: string;
    // ACTUAL_UNLOAD_DATE: string;
    // ACTUAL_DELIVERY_DATE: string;
    // TRANSIT_LEAD_TIME: string;
    // CANC_INV_STATUS: string;
    // STATUS: string;
    // STATUS_DESCRIPTION: string;
    // CREATED_ON?: Date;
    // CREATED_BY: string;
    // IS_ACTIVE: boolean;
}
export class CancelIRN{
    ID:number;
    CancelReason:string;
    CancelReasonRemark:string;
}
export class EinvoiceAuditLog{
    InvoiceID:string;
    InvNO:string;
    Plant:string;
    JsonValue:string;
    Responce:string;
}
