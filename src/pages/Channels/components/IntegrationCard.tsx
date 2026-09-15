import { Button } from "@/components/ui/button";
import { COOKIES_STORAGE } from "@/constants";
import { useAuthStore } from "@/stores";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import axios from "axios";
import { Link } from "react-router-dom";
const IntegrationCard = ({ data }: any) => {
  const accountId = useAuthStore((state) => state.accountId);
  // const whatsappService = new WhatsappService();
  const Icon = data.icon;

  const handleMeta = async () => {
    try {
      if (!accountId) return;

      const { data } = await axios.post(
        "http://localhost:3000/api/integration/meta/auth/connect",
        {
          accountId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CookieUtils.getItem(COOKIES_STORAGE.auth_token)}`,
          },
        },
      );

      console.log("Meta response:", data);

      const signupUrl = data?.result;
      console.log("Signup URL:", signupUrl);

      if (signupUrl) {
        window.open(
          signupUrl,
          "meta-login",
          "width=600,height=700,left=200,top=100",
        );
      }
    } catch (error) {
      console.error("Meta integration error:", error);
    }
  };

  // const handleWhatsapp = async () => {
  //   try {
  //     const response = await whatsappService.connectWhatsapp();
  //     console.log(response);

  //     // window.open(response?.data?.docs?.signupUrl);
  //     // console.log(response?.data?.docs?.signupUrl);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className=" mt-5 bg-gray-100 min-h-screen">
      <div className="w-full rounded-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${data.color} p-2 rounded-2xl`}>
                <Icon className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">{data.name}</h2>
            </div>

            <Button
              onClick={handleMeta}
              className={`${data.buttonColor} text-white`}
            >
              Integrate
            </Button>
          </div>

          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            {data.description}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>

            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              {data.features.map((feature: string) => (
                <li>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Resources</h3>

            <Link to="#" className="text-blue-600 text-sm hover:underline">
              {data.resourceText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
