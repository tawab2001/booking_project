import React, { useState } from "react";
import FristSection from '../../components/CreateEvent/FristSection';
import SecondSection from '../../components/CreateEvent/SecondSection';
import ThierdSection from '../../components/CreateEvent/ThierdSection';
// import FristSection from '../../components/CreateEvent/FristSection';
// import SecondSection from '../../components/CreateEvent/SecondSection';
// import ThierdSection from '../../components/CreateEvent/ThierdSection';

const AddEvent = () => {
  const [currentSection, setCurrentSection] = useState(1);

  const handleNext = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div>
      {currentSection === 1 && <FristSection/>}
      {currentSection === 2 && <SecondSection />}
      {currentSection === 3 && <ThierdSection />}

      <div className="d-flex justify-content-between mt-4 px-4">
        {currentSection > 1 && (
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        {currentSection < 3 && (
          <button
            className="btn btn-warning"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEvent;




