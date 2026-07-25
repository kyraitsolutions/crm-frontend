import SampleTemplateCard from "../cards/SampleTemplateCard"

const Explore = () => {
    const templates = [
        {
            id: 1,
            title: "Holi Abandoned Cart",
            type: "text",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "Hi [Shivam], Your cart is still waiting 👀 With Holi around the corner, stocks are moving fast. Complete your order now and use code HOLI20 to get 20% OFF + Free Shipping 🎉 Products in your cart: [Headway",
        },
        {
            id: 2,
            title: "Holi Wishes & Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 3,
            title: "Holi Wishes + Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 4,
            title: "Holi Wishes + Offer",
            type: "video",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "[Shivam], here's a special E-Gift Voucher for you😍 Applicable on minimum purchase of *[Rs 500]*. Apply Coupon Code *[DISC40]* and get Flat *[40%]* off. 🔥 Valid for Today only. Hurry Up!! ⏳ T&C Apply*",
        },
        {
            id: 1,
            title: "Holi Abandoned Cart",
            type: "text",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "Hi [Shivam], Your cart is still waiting 👀 With Holi around the corner, stocks are moving fast. Complete your order now and use code HOLI20 to get 20% OFF + Free Shipping 🎉 Products in your cart: [Headway",
        },
        {
            id: 2,
            title: "Holi Wishes & Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 3,
            title: "Holi Wishes + Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 4,
            title: "Holi Wishes + Offer",
            type: "video",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "[Shivam], here's a special E-Gift Voucher for you😍 Applicable on minimum purchase of *[Rs 500]*. Apply Coupon Code *[DISC40]* and get Flat *[40%]* off. 🔥 Valid for Today only. Hurry Up!! ⏳ T&C Apply*",
        },
        {
            id: 1,
            title: "Holi Abandoned Cart",
            type: "text",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "Hi [Shivam], Your cart is still waiting 👀 With Holi around the corner, stocks are moving fast. Complete your order now and use code HOLI20 to get 20% OFF + Free Shipping 🎉 Products in your cart: [Headway",
        },
        {
            id: 2,
            title: "Holi Wishes & Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 3,
            title: "Holi Wishes + Offer",
            type: "image",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "🎨✨ *Holi Special: Exclusive Discounts Just for You [Shivam]* Enjoy *[25%] % OFF* on [Bassheads 225] & celebrate this festival with BIG savings! But don’t wait too long—offer ends in [24 hours]! 🚀 💰 Get your Ho",
        },
        {
            id: 4,
            title: "Holi Wishes + Offer",
            type: "video",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66bRb7ovUb5H9rRt2Vc3B_AKg0kvWB-2Ll4InVziW9g&s=10",
            content:
                "[Shivam], here's a special E-Gift Voucher for you😍 Applicable on minimum purchase of *[Rs 500]*. Apply Coupon Code *[DISC40]* and get Flat *[40%]* off. 🔥 Valid for Today only. Hurry Up!! ⏳ T&C Apply*",
        },
    ];
    return (
        <div className=" grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
                <SampleTemplateCard
                    key={template.id}
                    title={template.title}
                    type={template.type}
                    image={template.image}
                    content={template.content}
                    onPreview={() => console.log("Preview", template.id)}
                    onSubmit={() => console.log("Submit", template.id)}
                    onOpen={() => console.log("Open", template.id)}
                />
            ))}
        </div>
    )
}

export default Explore