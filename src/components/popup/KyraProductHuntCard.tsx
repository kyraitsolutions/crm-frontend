import { ArrowLeft, } from "lucide-react";
import { useEffect, useState } from "react";

const KyraProductCard = () => {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setOpen(true);
        }, 2000)
    }, [])


    return (
        <div className="relative">
            {open &&
                <div
                    style={{
                        // fontFamily:
                        //     '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        // border: "1px solid #e0e0e0",
                        // borderRadius: "12px",
                        // padding: "20px",
                        // maxWidth: "500px",
                        // background: "#ffffff",
                        // boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",

                    }}
                    className="border fixed left-0 top-1/3 max-w-[300px] -translate-y-1/2 z-50 bg-white p-[20px] rounded-md"
                >
                    <div className="flex justify-end">
                        <ArrowLeft onClick={() => setOpen(false)} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "12px",
                        }}
                    >
                        <img
                            src="https://ph-files.imgix.net/6950c7f3-ca81-425a-b007-0bc15e3d7974.png?auto=format&fit=crop&w=80&h=80"
                            alt="Kyra CRM"
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                flexShrink: 0,
                            }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Kyra CRM
                            </h3>

                            <p
                                style={{
                                    margin: "4px 0 0",
                                    fontSize: "14px",
                                    color: "#666666",
                                    lineHeight: 1.4,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                Best crm software to generate quality leads
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://www.producthunt.com/products/kyra-crm?embed=true&utm_source=embed&utm_medium=post_embed"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "12px",
                            padding: "8px 16px",
                            background: "#16A34A",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        Check it out on Product Hunt →
                    </a>
                </div>
            }</div>
    );
};

export default KyraProductCard;
