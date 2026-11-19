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
            DEACTIVATE: 'Emails/Business/deactivate.html',
            OPERATING_STATUS: 'Emails/Business/status.html',

            WELCOME: 'Emails/vendor/welcome.html',
            PROFILE_UPDATE: 'Emails/vendor/profile-update.html',
            PROFILE_DEACTIVATED: 'Emails/vendor/profile-deactivated.html',
            PROFILE_ACTIVATED: 'Emails/vendor/profile-activated.html',
            OPERATING_STATUS_UPDATED: 'Emails/vendor/profile-operational.html',

            ACCOUNT_DELETED: 'Emails/vendor/account-deleted.html',
            CATEGORY_ASSIGNED: 'Emails/vendor/category-assigned.html',
            CATEGORY_REMOVED: 'Emails/vendor/category-removed.html',
            CATEGORY_DOCUMENT_UPLOADED: 'Emails/vendor/category-document-uploaded.html',
            CATEGORY_DOCUMENT_REMOVED: 'Emails/vendor/category-document-removed.html',
            BANK_DETAILS_ADDED: 'Emails/vendor/bank-details-added.html',
            BANK_DETAILS_REMOVED: 'Emails/vendor/bank-details-removed.html',
            PROFILE_CREATED: 'Emails/vendor/profile-created.html',
            PROFILE_UPDATED: 'Emails/vendor/profile-updated.html',
            PROFILE_DELETED: 'Emails/vendor/profile-deleted.html',
            DOCUMENT_UPLOADED: 'Emails/vendor/document-uploaded.html',
        },
        PACKAGE: {
            CREATE: 'Emails/Package/create.html',
            UPDATE: 'Emails/Package/update.html',
            DELETE: 'Emails/Package/delete.html',
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
            PROFILE_DELETED: 'vendor.profile_deleted',

            OPERATING_STATUS_UPDATED: 'vendor.operating_status_updated',

            BANK_DETAILS_ADDED: 'vendor.bank_details_added',
            BANK_DETAILS_REMOVED: 'vendor.bank_details_removed',

            DOCUMENT_UPLOADED: 'vendor.document_uploaded',
            PROFILE_UPDATE: 'vendor.profile_update',
            ACCOUNT_DELETED: 'vendor.account_deleted',
            CATEGORY_ASSIGNED: 'vendor.category_assigned',
            CATEGORY_REMOVED: 'vendor.category_removed',
            CATEGORY_DOCUMENT_UPLOADED: 'vendor.category_document_uploaded',
            CATEGORY_DOCUMENT_REMOVED: 'vendor.category_document_removed',
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
            BANK_DETAILS_UPDATED: "Bank Details Update",


            ACCOUNT_DELETED: 'Your Account Has Been Deleted',
            CATEGORY_ASSIGNED: 'Category Assigned To You',
            CATEGORY_REMOVED: 'Category Removed From You',
            CATEGORY_DOCUMENT_UPLOADED: 'Category Document Uploaded To You',
            CATEGORY_DOCUMENT_REMOVED: 'Category Document Removed From You',
            BANK_DETAILS_ADDED: 'Bank Details Added To You',
            BANK_DETAILS_REMOVED: 'Bank Details Removed From You',
            PROFILE_CREATED: 'Profile Created Successfully',
            PROFILE_UPDATED: 'Profile Updated Successfully',
            PROFILE_DELETED: 'Profile Deleted Successfully',
            OPERATING_STATUS_UPDATED: 'Operating Status Updated Successfully',
            DOCUMENT_UPLOADED: 'Document Uploaded Successfully',
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

                OPERATING_STATUS_UPDATED: "Business Profile Operational Status Update",
                PROFILE_DEACTIVATED: 'Business profile deactivated',

                BANK_DETAILS_UPDATED: "Bank Details Update",

                DOCUMENT_UPLOADED: 'Document uploaded',
                ACCOUNT_DELETED: 'Account deleted',
                CATEGORY_ASSIGNED: 'Category assigned',
                CATEGORY_REMOVED: 'Category removed',
                CATEGORY_DOCUMENT_UPLOADED: 'Category document uploaded',
                CATEGORY_DOCUMENT_REMOVED: 'Category document removed',
                BANK_DETAILS_ADDED: 'Bank details added',
                BANK_DETAILS_REMOVED: 'Bank details removed',
            },
            BODY: {
                WELCOME: 'Welcome to Tripdhara',
                PROFILE_CREATED: 'Your business profile has been created successfully',
                PROFILE_UPDATE: 'Your business profile has been updated successfully',

                OPERATING_STATUS_UPDATED: "Your business profile operational status has been updated successfully",
                PROFILE_DEACTIVATED: 'Your business profile has been deactivated',

                BANK_DETAILS_UPDATED: "Your bank details has been updated successfully",

                DOCUMENT_UPLOADED: 'Your document has been uploaded successfully',
                ACCOUNT_DELETED: 'Your account has been deleted successfully',
                CATEGORY_ASSIGNED: 'Your category has been assigned successfully',
                CATEGORY_REMOVED: 'Your category has been removed successfully',
                CATEGORY_DOCUMENT_UPLOADED: 'Your category document has been uploaded successfully',
                CATEGORY_DOCUMENT_REMOVED: 'Your category document has been removed successfully',
                BANK_DETAILS_ADDED: 'Your bank details has been added successfully',
                BANK_DETAILS_REMOVED: 'Your bank details has been removed successfully',
            },
            TYPE: {
                WELCOME: 'welcome',

                PROFILE_CREATED: 'business_profile_create',
                PROFILE_UPDATE: 'business_profile_update',

                OPERATING_STATUS_UPDATED: "operating_status_update",
                PROFILE_DEACTIVATED: 'profile_deactivated',

                DOCUMENT_UPLOADED: 'business_document_uploaded',

                BANK_DETAILS_UPDATED: "bank_details_update",

                ACCOUNT_DELETED: 'account_deleted',
                CATEGORY_ASSIGNED: 'category_assigned',
                CATEGORY_REMOVED: 'category_removed',
                CATEGORY_DOCUMENT_UPLOADED: 'category_document_uploaded',
                CATEGORY_DOCUMENT_REMOVED: 'category_document_removed',
                BANK_DETAILS_ADDED: 'bank_details_added',
                BANK_DETAILS_REMOVED: 'bank_details_removed',
            }
        }
    }
}