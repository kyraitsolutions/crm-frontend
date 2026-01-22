import FooterSection from "@/components/footer-section";
import TestimonialsSection from "@/components/testimonials-section";
import AboutCTA from "@/components/website/AboutCTA";
import AboutHero from "@/components/website/AboutHero";
// import CompanyJourney from "@/components/website/CompanyJourney";
import ContactForm from "@/components/website/ContactForm";
import Header from "@/components/website/Header";
import MissionVision from "@/components/website/MissionVision";
import Problem from "@/components/website/Problem";
import ProductPrinciples from "@/components/website/ProductPrinciples";
import Solution from "@/components/website/Solutions";
import UseCasesSection from "@/components/website/UseCasesSection";
import WhyChooseUs from "@/components/website/WhyChooseUs";

const About = () => {
    return (
        <div>
            <Header />
            <AboutHero />
            <MissionVision />
            <Problem />
            <Solution />
            <ProductPrinciples />
            <WhyChooseUs />
            <UseCasesSection />
            {/* <CompanyJourney /> */}
            {/* <TestimonialsSection /> */}
            <AboutCTA />
            <ContactForm />
            <FooterSection />
        </div>
    )
}

export default About;

