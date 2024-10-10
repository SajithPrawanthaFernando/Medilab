import React from "react";
import "../../App.css"; // Import your styles
import Hexagon from "./Hexagon"; // Import Hexagon component

// Import your images
import completeHealthcareIcon from "../../assets/images/health1.png";
import stableCloudIcon from "../../assets/images/cloud.png";
import secureReliableIcon from "../../assets/images/secure.png";
import patientCentricIcon from "../../assets/images/patientbed.png";
import affordableIcon from "../../assets/images/affordable.png";
import establishedTrustIcon from "../../assets/images/trust.png";

const ServicesSection = () => {
  return (
    <div className="container mx-auto bg-white pt-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        Why Choose <span className="text-blue-600">Medilab?</span>
      </h1>
      <p className="text-lg text-center mb-8  md:px-16 px-12">
        At Medilab, we are committed to revolutionizing the healthcare
        experience through technology. Our integrated solutions provide
        healthcare professionals with the tools they need to deliver top-notch
        care. Here’s why Medilab stands out in the healthcare industry:
      </p>
      <div className="flex flex-wrap justify-center">
        <Hexagon
          icon={completeHealthcareIcon}
          title="Complete Healthcare Solution"
          description="Fully integrated modular software architecture with seamless data flow between departments for effortless patient data management."
        />
        <Hexagon
          icon={stableCloudIcon}
          title="Stable Cloud Solution"
          description="Proven >99.99% uptime for more than a decade in service. Mobile apps for doctors and patients."
        />
        <Hexagon
          icon={secureReliableIcon}
          title="Secure & Reliable"
          description="Robust security protocols and data privacy policy safeguards customer data, ensuring confidentiality without any data commercialization."
        />
        <Hexagon
          icon={patientCentricIcon}
          title="Patient-Centric Design"
          description="24/7 appointment booking, instant notifications, feedback tools, and telemedicine platforms for higher patient engagement."
        />
        <Hexagon
          icon={affordableIcon}
          title="Affordable"
          description="Transparent, and modular pricing for scalability with a low upfront investment."
        />
        <Hexagon
          icon={establishedTrustIcon}
          title="Established Trust"
          description="Established Healthcare solutions provider, trusted by renowned clinics, hospitals, and multi-chain facilities."
        />
      </div>
    </div>
  );
};

export default ServicesSection;
