/**
 * KBM Platform — Integration Service
 * Adapters for Raslni, Ministry of Commerce (MoCI) activity codes,
 * KNET sandbox, and Microsoft Entra ID / Active Directory SSO.
 */

const MOCI_ACTIVITY_CATALOG = [
  { code: 'IT-SYS-01', name: 'Information Technology & Systems', nameAr: 'تكنولوجيا ونظم المعلومات', defaultGrade: 'SECOND' },
  { code: 'CYBER-SEC-09', name: 'Cyber Security Operations', nameAr: 'عمليات الأمن السيبراني', defaultGrade: 'FIRST' },
  { code: 'SEC-SURV-02', name: 'Security Surveillance & CCTV', nameAr: 'كاميرات المراقبة والأنظمة الأمنية', defaultGrade: 'SECOND' },
  { code: 'TELECOM-NET-03', name: 'Telecommunications & Fiber Networks', nameAr: 'الاتصالات وشبكات الألياف الضوئية', defaultGrade: 'THIRD' },
  { code: 'FACILITY-MGT-08', name: 'General Facility Maintenance', nameAr: 'صيانة المنشآت والمرافق العامة', defaultGrade: 'THIRD' }
];

class RaslniAdapter {
  constructor() {
    this.inbox = [];
  }

  simulateIncomingMessage({
    tenantId,
    messageId,
    senderMinistry,
    senderDepartment,
    subject,
    bodyText,
    attachments = []
  }) {
    const message = {
      id: messageId || `raslni-msg-${Date.now()}`,
      tenantId,
      sourceSystem: 'RASLNI_G2G',
      senderMinistry: senderMinistry || 'Ministry of Interior (MOI)',
      senderDepartment,
      subject,
      bodyText,
      attachments,
      receivedAt: new Date().toISOString(),
      status: 'PROCESSED'
    };
    this.inbox.push(message);
    return message;
  }

  listMessages(tenantId) {
    return this.inbox.filter(m => m.tenantId === tenantId);
  }
}

class MoCIClassificationAdapter {
  getCatalog() {
    return MOCI_ACTIVITY_CATALOG;
  }

  validateActivityCodes(codes = []) {
    const validCodes = MOCI_ACTIVITY_CATALOG.map(a => a.code);
    const valid = codes.every(c => validCodes.includes(c));
    const invalidCodes = codes.filter(c => !validCodes.includes(c));
    return { valid, invalidCodes };
  }
}

class EntraIdAdapter {
  constructor() {
    this.groupRoleMappings = {
      'SG-MOI-TENDER-STAFF': 'STAFF',
      'SG-MOI-ADMINS': 'TENANT_ADMIN',
      'SG-MOI-FINANCE': 'FINANCE_OFFICER',
      'SG-KBM-PLATFORM-OPS': 'OPERATOR'
    };
  }

  resolveRolesFromDirectoryGroups(adGroups = []) {
    const roles = [];
    adGroups.forEach(grp => {
      if (this.groupRoleMappings[grp]) {
        roles.push(this.groupRoleMappings[grp]);
      }
    });
    return roles.length > 0 ? roles : ['STAFF'];
  }
}

module.exports = {
  RaslniAdapter,
  MoCIClassificationAdapter,
  EntraIdAdapter,
  MOCI_ACTIVITY_CATALOG
};

