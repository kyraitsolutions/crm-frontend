import { useEffect, useState } from "react"
import { callService } from "../services/call.service";
import { useAuthStore } from "@/stores";
import MyNumberTable from "../components/MyNumberTable";

const PhoneNumber = () => {

    const { accountId } = useAuthStore((state) => state);
    const [myNumbers, setMyNumbers] = useState<[] | any>([]);
    const [loading, setLoading] = useState(false);
    const getMyNumbers = async () => {
        setLoading(true)
        try {
            const response = await callService.getMyNumbers(String(accountId));
            setMyNumbers(response.data?.docs)
            console.log(response.data.docs)
        } catch (error) {

            setMyNumbers([])
            console.error("error", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMyNumbers()
    }, [])

    return (
        <div>
            <div>

                <MyNumberTable myNumbers={myNumbers} loading={loading} />

            </div>
        </div>
    )
}

export default PhoneNumber