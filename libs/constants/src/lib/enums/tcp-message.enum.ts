enum PRODUCT {
  CREATE = 'product.create',
  GET = 'product.get',
  GET_ALL = 'product.get_all',
  GET_ALL_BY_IDS = 'product.get_all_by_ids',
  UPDATE = 'product.update',
  DELETE = 'product.delete',
}

enum INVOICE {
  CREATE = 'invoice.create',
  GET = 'invoice.get',
  GET_ALL = 'invoice.get_all',
  SEND = 'invoice.send',
  CHANGE_STATUS = 'invoice.change_status',
}

enum ROLE {
  GET_ALL = 'role.get_all',
}

enum USER {
  CREATE = 'user.create',
  GET = 'user.get',
  GET_ALL = 'user.get_all',
  GET_BY_KEYCLOAK_USER_ID = 'user.get_by_keycloak_user_id',
}

enum AUTHORIZER {
  LOGIN = 'authorizer.login',
  CREATE_KEYCLOAK_USER = 'authorizer.create_keycloak_user',
  VERIFY_TOKEN = 'authorizer.verify_token',
}

enum PDF_GENERATOR {
  CREATE_INVOICE_PDF = 'pdf_generator.create_invoice_pdf',
}

enum MEDIA {
  UPLOAD_FILE = 'media.upload_file',
  DESTROY_FILE = 'media.destroy_file',
}

enum PAYMENT {
  STRIPE = 'payment.stripe',
  STRIPE_EXPIRE = 'payment.stripe_expire',
}

export const TcpMessages = {
  PRODUCT,
  INVOICE,
  ROLE,
  USER,
  AUTHORIZER,
  PDF_GENERATOR,
  MEDIA,
  PAYMENT,
};
