package gov.cdc.usds.simplereport.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import gov.cdc.usds.simplereport.db.model.Person;
import gov.cdc.usds.simplereport.db.repository	.BaseRepositoryTest;
import gov.cdc.usds.simplereport.db.repository.FacilityRepository;
import gov.cdc.usds.simplereport.db.repository.OrganizationRepository;
import gov.cdc.usds.simplereport.db.repository.PersonRepository;

@SuppressWarnings("checkstyle:MagicNumber")
public class PersonServiceTest extends BaseRepositoryTest {

	private PersonService _service;

	public PersonServiceTest(@Autowired OrganizationRepository orgRepo, @Autowired FacilityRepository facilityRepo,
			@Autowired OrganizationInitializingService initService, @Autowired PersonRepository repo) {
		OrganizationService os= new OrganizationService(orgRepo, facilityRepo, initService);
		_service = new PersonService(os, repo);
	}

	@Test
	public void roundTrip() {
		_service.addPatient("FOO", "Fred", null, "Fosbury", "Sr.", LocalDate.of(1865, 12, 25), "123 Main", "Apartment 3", "Hicksville", "NY",
			"11801", "(888) GET-BENT", null, null, "Nassau", null, null, null, false, false);
		_service.addPatient("BAR", "Basil", null, "Barnacle", "4th", LocalDate.of(1865, 12, 25), "13 Main",null, "Hicksville", "NY",
				"11801", "(888) GET-BENT", "STAFF", null, "Nassau", null, null, null, false, false);
		List<Person> all = _service.getPatients();
		assertEquals(2, all.size());
	}

}
