package gov.cdc.usds.simplereport.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gov.cdc.usds.simplereport.api.model.errors.IllegalGraphqlArgumentException;
import gov.cdc.usds.simplereport.db.model.PatientLink;
import gov.cdc.usds.simplereport.db.model.TestOrder;
import gov.cdc.usds.simplereport.db.repository.PatientLinkRepository;
import gov.cdc.usds.simplereport.db.repository.TestOrderRepository;

@Service
@Transactional(readOnly = true)
public class PatientLinkService {
    private PatientLinkRepository _plrepo;
    private TestOrderRepository _torepo;

    public PatientLinkService(PatientLinkRepository plrepo, TestOrderRepository torepo) {
        _plrepo = plrepo;
        _torepo = torepo;
    }

    public PatientLink getPatientLinkById(String internalId) {
        System.out.println("------------------------------");
        System.out.println(internalId);
        System.out.println("------------------------------");
        UUID actualId = UUID.fromString(internalId);
        return _plrepo.findById(actualId)
                .orElseThrow(() -> new IllegalGraphqlArgumentException("No patient link with that ID was found"));
    }

    public List<PatientLink> fetchPatientLinks() {
        return _plrepo.findAll();
    }

    public PatientLink createPatientLink(UUID testOrderUuid) {
        TestOrder to = _torepo.findById(testOrderUuid)
                .orElseThrow(() -> new IllegalGraphqlArgumentException("No test order with that ID was found"));
        PatientLink pl = new PatientLink(to);
        return _plrepo.save(pl);
    }
}
