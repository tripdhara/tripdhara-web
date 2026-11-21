export const NOTIFICATION = {
    TEMPLATE: {
        AUTHANTICATION: {
            OTP: 'Emails/Authentication/otp.html',
            WELCOME: 'Emails/Authentication/welcome.html',
            ALERT: 'Emails/Authentication/alert.html',
        },
        BOOKING: {

        },
        BUSINESS: {
            CREATE: 'Emails/Business/create.html',
            UPDATE: 'Emails/Business/update.html',
            ACTIVATE: 'Emails/Business/activate.html',
            DEACTIVATE: 'Emails/Business/deactivate.html',
            APPROVE: 'Emails/Business/approve.html',
            OPERATIONAL: 'Emails/Business/operational.html',

            WELCOME: 'Emails/vendor/welcome.html',
            PROFILE_UPDATE: 'Emails/vendor/profile-update.html',
            PROFILE_DEACTIVATED: 'Emails/vendor/profile-deactivated.html',
            PROFILE_ACTIVATED: 'Emails/vendor/profile-activated.html',
            PROFILE_APPROVED: 'Emails/vendor/profile-approved.html',
            OPERATING_STATUS_UPDATED: 'Emails/vendor/profile-operational.html',

            DOCUMENT_UPLOADED: 'Emails/vendor/documents.html',

            BANK_DETAILS_CREATED: 'Emails/vendor/bank.html',
            BANK_DETAILS_UPDATED: 'Emails/vendor/bank.html',
            BANK_DETAILS_REMOVED: 'Emails/vendor/bank.html',

            ACCOUNT_DELETED: 'Emails/vendor/account-deleted.html',
            CATEGORY_ASSIGNED: 'Emails/vendor/category-assigned.html',
            CATEGORY_REMOVED: 'Emails/vendor/category-removed.html',

            PROFILE_CREATED: 'Emails/vendor/profile-created.html',
            PROFILE_UPDATED: 'Emails/vendor/profile-updated.html',
            PROFILE_DELETED: 'Emails/vendor/profile-deleted.html',
        },
        CATEGORY: {
            CATEGORY_DOCUMENT_UPLOADED: 'Emails/Category/upload.html',
            CATEGORY_DOCUMENT_REMOVED: 'Emails/vendor/category-document-removed.html',
        },
        PACKAGE: {
            CREATE: 'Emails/Package/create.html',
            UPDATE: 'Emails/Package/update.html',
            DELETE: 'Emails/Package/delete.html',
            STATUS: 'Emails/Package/status.html',
        },
        SYSTEM: {

        },
        USER: {
            CREATE: 'Emails/User/create.html',
            UPDATE: 'Emails/User/update.html',
            DELETE: 'Emails/User/delete.html',

            OTP: 'Emails/otp.html',
            WELCOME: 'Emails/welcome.html',
            ALERT: 'Emails/alert.html',

            OFFER: 'Emails/offer.html',
            AD: 'Emails/ad.html',
            NEWSLETTER: 'Emails/newsletter.html',

            PROFILE: {
                CREATED: 'Emails/profile-created.html',
                UPDATED: 'Emails/Profile/profile-updated.html',
                DELETED: 'Emails/profile-deleted.html',
            },

        }
    },
    KEY: {
        USER: {
            OTP: 'auth.otp',
            WELCOME: 'auth.welcome',
            ALERT: 'auth.alert',

            OFFER: 'user.offer',
            AD: 'user.ad',
            NEWSLETTER: 'user.newsletter',

            PROFILE: {
                CREATED: 'user.profile_created',
                UPDATED: 'user.profile_updated',
                DELETED: 'user.profile_deleted',
            },
        },
        BUSINESS: {
            PROFILE_CREATED: 'vendor.profile_created',
            PROFILE_UPDATED: 'vendor.profile_updated',
            PROFILE_ACTIVATED: 'vendor.profile_activated',
            PROFILE_DEACTIVATED: 'vendor.profile_deactivated',
            PROFILE_APPROVED: 'vendor.profile_approved',
            PROFILE_DELETED: 'vendor.profile_deleted',

            OPERATING_STATUS_UPDATED: 'vendor.operating_status_updated',

            BANK: {
                CREATED: 'vendor.created',
                UPDATED: 'vendor.updated',
                DELETED: 'vendor.deleted',
            },

            CATEGORY_DOCUMENT_UPLOADED: 'vendor.category_document_uploaded',
            CATEGORY_DOCUMENT_REMOVED: 'vendor.category_document_removed',

            DOCUMENT_UPLOADED: 'vendor.document_uploaded',

            PACKAGE_CREATED: 'vendor.package_created',
            PACKAGE_UPDATED: 'vendor.package_updated',
            PACKAGE_DELETED: 'vendor.package_deleted',

            PROFILE_UPDATE: 'vendor.profile_update',
            ACCOUNT_DELETED: 'vendor.account_deleted',

            CATEGORY_ASSIGNED: 'vendor.category_assigned',
            CATEGORY_REMOVED: 'vendor.category_removed',
        }
    },
    SUBJECT: {
        AUTH: {
            OTP: "Tripdhara - One Time Password",
            WELCOME: "Welcome To Tripdhara",
            ALERT: "Tripdhara - New Login Alert",
        },
        USER: {
            PROFILE_UPDATE: 'Tripdhara - Profile Updated',
        },
        BUSINESS: {
            WELCOME: 'Welcome To Tripdhara',
            PROFILE_CREATED: 'Business Profile Created',
            PROFILE_UPDATE: 'Business Profile Updated',
            PROFILE_DEACTIVATED: 'Business Profile Deactivated',
            PROFILE_ACTIVATED: 'Business Profile Activated',
            PROFILE_APPROVED: 'Business Profile Approved',

            DOCUMENT_UPLOADED: 'Document Uploaded Successfully',

            BANK: {
                BANK_DETAILS_CREATED: 'Bank Details Added To You',
                BANK_DETAILS_UPDATED: "Bank Details Update",
                BANK_DETAILS_REMOVED: 'Bank Details Removed From You',
            },

            CATEGORY_DOCUMENT_UPLOADED: 'Category Document Uploaded To You',
            CATEGORY_DOCUMENT_REMOVED: 'Category Document Removed From You',

            PACKAGE_CREATED: 'New Package Item Created',
            PACKAGE_UPDATED: 'Package Item Updated',
            PACKAGE_DELETED: 'Package Item Status Updated',
            PACKAGE_STATUS_UPDATED: 'Package Item Status Updated',


            ACCOUNT_DELETED: 'Your Account Has Been Deleted',
            CATEGORY_ASSIGNED: 'Category Assigned To You',
            CATEGORY_REMOVED: 'Category Removed From You',
            PROFILE_CREATED: 'Profile Created Successfully',
            PROFILE_UPDATED: 'Profile Updated Successfully',
            PROFILE_DELETED: 'Profile Deleted Successfully',
            OPERATING_STATUS_UPDATED: 'Operating Status Updated Successfully',
            ACCOUNT_DELETED: 'Account Deleted Successfully',
        }
    },
    PUSH: {
        USER: {
            TITLE: {
                WELCOME: 'Welcome to Tripdhara',
                PROFILE_UPDATE: 'Profile updated',

            },
            BODY: {
                WELCOME: 'Welcome to Tripdharal. Explore the best of tourism with our platform.',
                PROFILE_UPDATE: 'Your profile has been updated successfully',

            },
            TYPE: {
                WELCOME: 'user_welcome',
                PROFILE_UPDATE: 'profile_updated',

            }
        },
        BUSINESS: {
            TITLE: {
                WELCOME: 'Welcome to Tripdhara',
                PROFILE_CREATED: 'Business profile created',
                PROFILE_UPDATE: 'Business profile updated',

                PROFILE_ACTIVATED: 'Business profile activated',
                PROFILE_DEACTIVATED: 'Business profile deactivated',
                PROFILE_APPROVED: 'Business Profile Approved',

                OPERATING_STATUS_UPDATED: "Business Profile Operational Status Update",

                BANK_DETAILS_CREATED: 'Bank Details Added',
                BANK_DETAILS_UPDATED: "Bank Details Update",
                BANK_DETAILS_REMOVED: 'Bank Details Removed',

                CATEGORY_DOCUMENT_UPLOADED: 'Category document uploaded',
                CATEGORY_DOCUMENT_REMOVED: 'Category document removed',

                PACKAGE_CREATED: 'Package Created',
                PACKAGE_UPDATED: 'Package Updated',
                PACKAGE_DELETED: 'Package Deleted',
                PACKAGE_STATUS_UPDATED: 'Package Status Updated',

                DOCUMENT_UPLOADED: 'Document uploaded',
                ACCOUNT_DELETED: 'Account deleted',
                CATEGORY_ASSIGNED: 'Category assigned',
                CATEGORY_REMOVED: 'Category removed',
            },
            BODY: {
                WELCOME: 'Welcome to Tripdhara',
                PROFILE_CREATED: 'Your business profile has been created successfully',
                PROFILE_UPDATE: 'Your business profile has been updated successfully',

                PROFILE_DEACTIVATED: 'Your business profile has been deactivated',
                PROFILE_ACTIVATED: 'Your business profile has been activated',
                PROFILE_APPROVED: 'Your business profile has been Approved',

                OPERATING_STATUS_UPDATED: "Your business profile operational status has been updated successfully",

                BANK_DETAILS_CREATED: 'Your bank details has been added successfully',
                BANK_DETAILS_UPDATED: "Your bank details has been updated successfully",
                BANK_DETAILS_REMOVED: 'Your bank details has been removed successfully',

                PACKAGE_CREATED: 'Your listing has been created successfully.',
                PACKAGE_UPDATED: 'Your listing has been updated successfully.',
                PACKAGE_DELETED: 'Your listing has been deleted successfully.',
                PACKAGE_STATUS_UPDATED: 'Your listing status has been updated successfully.',

                DOCUMENT_UPLOADED: 'documents has been uploaded successfully',
                ACCOUNT_DELETED: 'Your account has been deleted successfully',
                CATEGORY_ASSIGNED: 'Your category has been assigned successfully',
                CATEGORY_REMOVED: 'Your category has been removed successfully',

                CATEGORY_DOCUMENT_UPLOADED: 'documents has been uploaded successfully',
                CATEGORY_DOCUMENT_REMOVED: 'Your category document has been removed successfully',
            },
            TYPE: {
                WELCOME: 'welcome',

                PROFILE_CREATED: 'business_profile_create',
                PROFILE_UPDATE: 'business_profile_update',

                PROFILE_ACTIVATED: 'business_profile_activated',
                PROFILE_DEACTIVATED: 'business_profile_deactivated',
                PROFILE_APPROVED: 'business_profile_approved',

                OPERATING_STATUS_UPDATED: "operating_status_update",

                DOCUMENT_UPLOADED: 'business_document_uploaded',

                BANK_DETAILS_CREATED: 'business_bank_details_created',
                BANK_DETAILS_UPDATED: "business_bank_details_updated",
                BANK_DETAILS_REMOVED: 'business_bank_details_Removed',

                PACKAGE_CREATED: 'package_created',
                PACKAGE_UPDATED: 'package_updated',
                PACKAGE_DELETED: 'package_deleted',
                PACKAGE_STATUS_UPDATED: 'package_status_updated',

                ACCOUNT_DELETED: 'account_deleted',

                CATEGORY_ASSIGNED: 'category_assigned',
                CATEGORY_REMOVED: 'category_removed',

                CATEGORY_DOCUMENT_UPLOADED: 'category_document_uploaded',
                CATEGORY_DOCUMENT_REMOVED: 'category_document_removed',
            }
        }
    }
}