"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera, Mail, Phone, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountService } from "@/services/account.service";
import { useAuthStore } from "@/stores";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { isAdmin } from "@/rbac";

// ---- Types ----
type ProfileState = {
  firstName: string;
  lastName: string;
  fullName: string;
  accountType: string;
  accountName: string;
  phone: string;
  avatar: string | null;
  emails: string[];
  supportEmail: string;
};

export default function ProfilePage() {
  const params = useParams();
  const { user } = useAuthStore((state) => state);
  const accountService = new AccountService();

  console.log(user);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    fullName: "",
    accountType: "",
    accountName: "",
    phone: "",
    avatar: null,
    emails: [],
    supportEmail: "",
  });

  // ---- Avatar Upload ----
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const payload = {
      accountName: profile.accountName,
      emails: profile.emails,
      supportEmail: profile.supportEmail,
      phone: profile.phone,
      avatar: profile.avatar,
    };

    console.log("SAVE", payload);
    setEditMode(false);
  };

  // ---- Map API (SINGLE STATE SET) ----
  const mapData = (data: any) => {
    console.log("profile", data);
    setProfile({
      firstName: data?.userprofile?.firstName || "",
      lastName: data?.userprofile?.lastName || "",
      fullName:
        `${data?.userprofile?.firstName || ""} ${data?.userprofile?.lastName || ""}`.trim(),

      accountType: data?.userprofile?.accountType || "",
      accountName: data?.userprofile?.organizationName || "",
      phone: data?.phone || "",
      avatar: data?.profilePicture || null,
      emails: data?.email ? [data.email] : [],
      supportEmail: data?.supportEmail || "",
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAccountById(
        params?.accountId || "",
      );

      console.log(response);

      if (response?.status === 200) {
        mapData(response?.data?.doc);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.accountId && params?.account_type === "account") {
      fetchProfile();
    } else {
      mapData(user);
    }
  }, [params?.accountId]);

  const is_admin = isAdmin(user?.roleId);

  return (
    <div className="p-6 mx-auto bg-gray-50 h-screen space-y-6">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-100 to-yellow-100 p-6 rounded flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              {profile.avatar && (
                <AvatarImage className="object-cover" src={profile.avatar} />
              )}
              <AvatarFallback>
                {getFirstWordOfSentence(profile.fullName) || "A"}
              </AvatarFallback>
            </Avatar>

            {editMode && (
              <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
                <Camera size={14} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {profile?.fullName || "Account"}
            </h2>
            <p className="text-sm text-gray-600">
              {profile.emails[0] || "No email"}
            </p>
          </div>
        </div>

        {is_admin && (
          <Button
            className="bg-primary hover:bg-primary hover:text-white text-white rounded px-5!"
            variant="outline"
            onClick={() => setEditMode(!editMode)}
          >
            <Pencil size={5} className="" />
            {editMode ? "Cancel" : "Edit"}
          </Button>
        )}
      </div>

      {/* FORM */}
      <div className="bg-white rounded p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm text-gray-500">First Name</Label>
            <Input
              className=" border shadow-none rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl"
              value={profile.firstName}
              disabled={!editMode}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Last Name</Label>
            <Input
              className=" border shadow-none rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl"
              value={profile.lastName}
              disabled={!editMode}
              onChange={(e) =>
                setProfile((p) => ({ ...p, nickName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-500">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="border-0 shadow-none border rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl px-8"
                value={profile.phone}
                disabled={!editMode}
                placeholder="9199999999"
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* EMAILS */}
        <div className="space-y-8">
          <h3 className="font-medium mb-4">Email Addresses</h3>

          <div className="grid grid-cols-2 items-center gap-6">
            {profile.emails.map((email, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-xs text-gray-400">
                  {index === 0 ? "Primary Email" : "Secondary Email"}
                </Label>

                <div className="relative">
                  <Mail className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="border-0 border shadow-none rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl px-8"
                    value={email}
                    disabled={!editMode}
                    onChange={(e) => {
                      const updated = [...profile.emails];
                      updated[index] = e.target.value;
                      setProfile((p) => ({ ...p, emails: updated }));
                    }}
                  />
                </div>
              </div>
            ))}

            {profile?.emails?.length === 1 && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">
                  Secondary Email ( Optional )
                </Label>

                <div className="relative">
                  <Mail className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="border-0 border shadow-none rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl px-8"
                    placeholder="Secondary Email"
                    value={profile.emails[1]}
                    disabled={!editMode}
                    onChange={(e) => {
                      const updated = [...profile.emails];
                      updated[1] = e.target.value;
                      setProfile((p) => ({ ...p, emails: updated }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SUPPORT EMAIL */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Support Email</Label>

            <div className="relative">
              <Mail className="absolute left-2 top-3 h-4 w-4 text-gray-400" />

              <Input
                className="border-0 border shadow-none rounded-none focus-visible:ring-0 disabled:border disabled:bg-gray-100 disabled:border-foreground/40 disabled:rounded-xl px-8"
                placeholder="support@email.com"
                value={profile.supportEmail}
                disabled={!editMode}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    supportEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { AccountService } from "@/services/account.service";
// import { useAuthStore } from "@/stores";
// import { Camera, Mail, Pencil, Phone } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// // ---- Types ----
// type EmailSet = {
//   primary: string;
//   secondary: string;
//   support: string;
// };

// export default function ProfilePage() {
//   const params = useParams();
//   const { user } = useAuthStore((state) => state);

//   const accountService = new AccountService();

//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   const [avatar, setAvatar] = useState<string | null>(null);
//   const [name, setName] = useState("");
//   const [nickName, setNickName] = useState("");
//   const [phone, setPhone] = useState("");

//   const [emails, setEmails] = useState<EmailSet>({
//     primary: "",
//     secondary: "",
//     support: "",
//   });

//   // ---- Avatar Upload ----
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setAvatar(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   // ---- Map API ----
//   const mapData = (data: any) => {
//     setName(data?.accountName || "");

//     let primary = "";
//     if (Array.isArray(data.email)) {
//       primary = data.email[0] || "";
//     } else {
//       primary = data.email || "";
//     }

//     setEmails({
//       primary,
//       secondary: data.secondaryEmail || "",
//       support: data.supportEmail || "",
//     });

//     setPhone(data?.phone || "");
//   };

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await accountService.getAccountById(params?.accountId || "");
//       mapData(res?.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (params?.accountId && params?.account_type === "account") {
//       fetchProfile();
//     }
//   }, []);

//   const handleSave = () => {
//     const payload = {
//       accountName: name,
//       emails: [emails.primary, emails.secondary, emails.support].filter(
//         Boolean,
//       ),
//       phone,
//       avatar,
//     };

//     console.log("SAVE", payload);
//     setEditMode(false);
//   };

//   return (
//     <div className="p-6 mx-auto space-y-6">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-6 rounded-2xl flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Avatar className="w-16 h-16">
//               {avatar && <AvatarImage src={avatar} />}
//               <AvatarFallback>{name?.charAt(0) || "A"}</AvatarFallback>
//             </Avatar>

//             {editMode && (
//               <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
//                 <Camera size={14} />
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleImageChange}
//                 />
//               </label>
//             )}
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold">{name || "Account"}</h2>
//             <p className="text-sm text-gray-600">
//               {emails.primary || "No email"}
//             </p>
//           </div>
//         </div>

//         <Button variant="outline" onClick={() => setEditMode(!editMode)}>
//           <Pencil size={16} className="mr-2" />
//           {editMode ? "Cancel" : "Edit"}
//         </Button>
//       </div>

//       {/* FORM */}
//       <div className="bg-white rounded-2xl shadow p-6 space-y-6">
//         {/* GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label className="text-sm text-gray-500">Full Name</Label>
//             <Input
//               className="border-0 border-b rounded-none focus-visible:ring-0"
//               value={name}
//               disabled={!editMode}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-sm text-gray-500">Nick Name</Label>
//             <Input
//               className="border-0 border-b rounded-none focus-visible:ring-0"
//               value={nickName}
//               disabled={!editMode}
//               onChange={(e) => setNickName(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-sm text-gray-500">Phone</Label>
//             <div className="relative">
//               <Phone className="absolute left-0 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 className="pl-6 border-0 border-b rounded-none focus-visible:ring-0"
//                 value={phone}
//                 disabled={!editMode}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* EMAIL SECTION */}
//         <div className="space-y-4">
//           <h3 className="font-medium">Email Addresses</h3>

//           <div className="space-y-3">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-400">Primary Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-0 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     className="pl-6 border-0 border-b rounded-none focus-visible:ring-0"
//                     value={emails.primary}
//                     disabled={!editMode}
//                     onChange={(e) =>
//                       setEmails((p) => ({ ...p, primary: e.target.value }))
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <Label className="text-xs text-gray-400">Secondary Email</Label>
//                 <Input
//                   className="border-0 border-b rounded-none focus-visible:ring-0"
//                   value={emails.secondary}
//                   disabled={!editMode}
//                   onChange={(e) =>
//                     setEmails((p) => ({ ...p, secondary: e.target.value }))
//                   }
//                 />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <Label className="text-xs text-gray-400">Support Email</Label>
//               <Input
//                 className="border-0 border-b rounded-none focus-visible:ring-0"
//                 value={emails.support}
//                 disabled={!editMode}
//                 onChange={(e) =>
//                   setEmails((p) => ({ ...p, support: e.target.value }))
//                 }
//               />
//             </div>
//           </div>
//         </div>

//         {editMode && (
//           <div className="flex justify-end pt-4">
//             <Button onClick={handleSave} disabled={loading}>
//               Save Changes
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
