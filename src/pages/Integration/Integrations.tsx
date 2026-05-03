import React, { useState } from 'react'

type Integration = {
    id: string;
    name: string;
    logo: string; // URL or Lucide icon name
    status: 'Connected' | 'Not Connected';
    category: string;
};

const integrations: Integration[] = [

    { id: '1', name: 'Zoho CRM', logo: '🔗', status: 'Not Connected', category: 'Zoho' },
    { id: '2', name: 'Bigin', logo: '▽', status: 'Not Connected', category: 'Zoho' },
    { id: '3', name: 'BulkSMS', logo: '✉', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '4', name: 'Clickatell', logo: '🔗', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '5', name: 'MessageBird', logo: '🕊', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '6', name: 'Sinch MessageMedia', logo: '₪', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '7', name: 'MiSMS', logo: 'mi', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '8', name: 'Vonage', logo: 'V', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '9', name: 'Msg91', logo: '✉', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '10', name: 'Twilio', logo: 'Ⓣ', status: 'Not Connected', category: 'SMS Gateways' },
    { id: '11', name: 'Shopify', logo: '🛍️', status: 'Not Connected', category: 'e-commerce' },
    { id: '12', name: 'Zoho Recruit', logo: '👤', status: 'Not Connected', category: 'Zoho' },
    { id: '13', name: 'Zoho Forms', logo: '📝', status: 'Not Connected', category: 'Zoho' },
    { id: '14', name: 'Zoho Analytics', logo: '📊', status: 'Not Connected', category: 'Zoho' },
    { id: '15', name: 'Zoho Commerce', logo: '🛒', status: 'Not Connected', category: 'Zoho' },
    { id: '16', name: 'Salesforce', logo: '☁️', status: 'Not Connected', category: 'Sales' },
    { id: '17', name: 'SugarCRM', logo: '🧊', status: 'Not Connected', category: 'Sales' },
    { id: '18', name: 'MS Dynamics 365', logo: '💠', status: 'Not Connected', category: 'Sales' },
    { id: '19', name: 'Google Drive', logo: '📁', status: 'Not Connected', category: 'Cloud Storage' },
    { id: '20', name: 'DropBox', logo: '📦', status: 'Not Connected', category: 'Cloud Storage' },
    { id: '21', name: 'OneDrive', logo: '☁️', status: 'Not Connected', category: 'Cloud Storage' },
    { id: '22', name: 'Box', logo: '📦', status: 'Not Connected', category: 'Cloud Storage' },
    { id: '23', name: 'Evernote', logo: '🐘', status: 'Not Connected', category: 'Marketing' },
    { id: '24', name: 'Zoho Creator', logo: '🛠️', status: 'Not Connected', category: 'Zoho' },
    { id: '25', name: 'Zoho Contacts', logo: '📇', status: 'Not Connected', category: 'Zoho' },
    { id: '26', name: 'Exotel', logo: '📞', status: 'Not Connected', category: 'Communication' },
    //     // ... add remaining items
    // { id: '1', name: 'Zoho CRM', logo: 'https://logo.clearbit.com/zoho.com', status: 'Not Connected', category: 'Zoho' },
    // { id: '2', name: 'Bigin', logo: 'https://www.bigin.com/favicon.ico', status: 'Not Connected', category: 'Zoho' },
    // { id: '3', name: 'BulkSMS', logo: 'https://logo.clearbit.com/bulksms.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '4', name: 'Clickatell', logo: 'https://logo.clearbit.com/clickatell.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '5', name: 'MessageBird', logo: 'https://logo.clearbit.com/messagebird.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '6', name: 'Sinch MessageMedia', logo: 'https://logo.clearbit.com/sinch.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '7', name: 'MiSMS', logo: 'https://www.misms.in/images/misms-logo.png', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '8', name: 'Vonage', logo: 'https://logo.clearbit.com/vonage.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '9', name: 'Msg91', logo: 'https://logo.clearbit.com/msg91.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '10', name: 'Twilio', logo: 'https://logo.clearbit.com/twilio.com', status: 'Not Connected', category: 'SMS Gateways' },
    // { id: '11', name: 'Shopify', logo: 'https://logo.clearbit.com/shopify.com', status: 'Not Connected', category: 'e-commerce' },
    // { id: '12', name: 'Zoho Recruit', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/recruit/zoho-recruit-logo.svg', status: 'Not Connected', category: 'Zoho' },
    // { id: '13', name: 'Zoho Forms', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/forms/zoho-forms-logo.svg', status: 'Not Connected', category: 'Zoho' },
    // { id: '14', name: 'Zoho Analytics', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/analytics/zoho-analytics-logo.svg', status: 'Not Connected', category: 'Zoho' },
    // { id: '15', name: 'Zoho Commerce', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/commerce/zoho-commerce-logo.svg', status: 'Not Connected', category: 'Zoho' },
    // { id: '16', name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com', status: 'Not Connected', category: 'Sales' },
    // { id: '17', name: 'SugarCRM', logo: 'https://logo.clearbit.com/sugarcrm.com', status: 'Not Connected', category: 'Sales' },
    // { id: '18', name: 'MS Dynamics 365', logo: 'https://logo.clearbit.com/microsoft.com', status: 'Not Connected', category: 'Sales' },
    // { id: '19', name: 'Google Drive', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg', status: 'Not Connected', category: 'Cloud Storage' },
    // { id: '20', name: 'DropBox', logo: 'https://logo.clearbit.com/dropbox.com', status: 'Not Connected', category: 'Cloud Storage' },
    // { id: '21', name: 'OneDrive', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg', status: 'Not Connected', category: 'Cloud Storage' },
    // { id: '22', name: 'Box', logo: 'https://logo.clearbit.com/box.com', status: 'Not Connected', category: 'Cloud Storage' },
    // { id: '23', name: 'Evernote', logo: 'https://logo.clearbit.com/evernote.com', status: 'Not Connected', category: 'Marketing' },
    // { id: '24', name: 'Zoho Creator', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/creator/zoho-creator-logo.svg', status: 'Not Connected', category: 'Zoho' },
    // { id: '25', name: 'Zoho Contacts', logo: 'https://www.zohowebstatic.com/sites/zwebsh/images/contacts/zoho-contacts-logo.svg', status: 'Not Connected', category: 'Zoho' },
];


const categories = ["All", "Zoho", "MarketPlace", "Image Hubs", "CMS", "Cloud Storage", "Communication", "e-commerce", "Marketing", "Sales", "SMS Gateways"];

const Integrations = () => {
    const [activeTab, setActiveTab] = useState('All');

    const filterData = activeTab === "All" ? integrations : integrations.filter((item) => item.category === activeTab);


    return (
        <div className="min-h-screen bg-white p-6 font-sans text-slate-700">
            {/* Filter Tabs */}
            <nav className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`rounded px-4 py-1 text-sm border transition-all ${activeTab === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
                <button className="text-sm text-primary ml-auto">Show more</button>
            </nav>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-slate-100">
                {filterData?.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col items-center justify-center border-r border-b border-slate-100 p-12 hover:scale-105 transition-all hover:shadow transition-hover hover:bg-slate-50 group cursor-pointer"
                    >
                        {/* Logo Placeholder */}
                        <div className="mb-6 text-4xl text-slate-400 transition-all">
                            {item.logo}
                        </div>
                        {/* <div className="mb-6 h-12 w-12 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                            <img
                                src={item.logo}
                                alt={`${item.name} logo`}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                    // Fallback if an image fails to load
                                    e.currentTarget.src = "https://via.placeholder.com/48?text=" + item.name[0];
                                }}
                            />
                        </div> */}

                        <h3 className="mb-8 text-lg text-primary">{item.name}</h3>

                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-slate-500">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Integrations;