import Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportData {
    totalLeads: number;
    todayLeads: number;
    weeklyLeads: number;
    monthlyLeads: number;
    conversionRate: number;
    avgResponseTime: number;
    leadsBySource: Array<{ source: string; count: number; trend: number }>;
    leadsByStatus: Array<{ status: string; count: number; percentage: number }>;
    channelPerformance: Array<{
        channel: string;
        leads: number;
        conversions: number;
        conversionRate: number;
    }>;
    recentLeads: Array<{
        name: string;
        source: string;
        status: string;
        date: string;
        time: string;
    }>;
}

export const exportToCSV = (data: ExportData, filename: string = "crm-analytics") => {
    // Prepare overview data
    const overview = [
        ["CRM Analytics Report", ""],
        ["Generated", new Date().toLocaleString()],
        ["", ""],
        ["Key Metrics", ""],
        ["Total Leads", data.totalLeads],
        ["Today's Leads", data.todayLeads],
        ["Weekly Leads", data.weeklyLeads],
        ["Monthly Leads", data.monthlyLeads],
        ["Conversion Rate", `${data.conversionRate}%`],
        ["Avg Response Time", `${data.avgResponseTime}m`],
        ["", ""],
    ];

    // Leads by Source
    const sourceHeader = [["Leads by Source", "", ""]];
    const sourceData = [["Source", "Count", "Trend %"]];
    data.leadsBySource.forEach((item) => {
        sourceData.push([item.source, item.count.toString(), `${item.trend}%`]);
    });

    // Leads by Status
    const statusHeader = [["", ""], ["Leads by Status", "", ""]];
    const statusData = [["Status", "Count", "Percentage"]];
    data.leadsByStatus.forEach((item) => {
        statusData.push([item.status, item.count.toString(), `${item.percentage}%`]);
    });

    // Channel Performance
    const channelHeader = [["", ""], ["Channel Performance", "", "", ""]];
    const channelData = [["Channel", "Leads", "Conversions", "Conversion Rate"]];
    data.channelPerformance.forEach((item) => {
        channelData.push([
            item.channel,
            item.leads.toString(),
            item.conversions.toString(),
            `${item.conversionRate}%`,
        ]);
    });

    // Recent Leads
    const recentHeader = [["", ""], ["Recent Leads", "", "", "", ""]];
    const recentData = [["Name", "Source", "Status", "Date", "Time"]];
    data.recentLeads.forEach((item) => {
        recentData.push([item.name, item.source, item.status, item.date, item.time]);
    });

    // Combine all data
    const allData = [
        ...overview,
        ...sourceHeader,
        ...sourceData,
        ...statusHeader,
        ...statusData,
        ...channelHeader,
        ...channelData,
        ...recentHeader,
        ...recentData,
    ];

    // Convert to CSV
    const csv = Papa.unparse(allData);

    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = async (
    data: ExportData,
    filename: string = "crm-analytics"
) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(37, 99, 235); // Primary color
    pdf.text("CRM Analytics Report", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
    );

    yPosition += 15;

    // Key Metrics Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Key Metrics", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    const metrics = [
        ["Total Leads", data.totalLeads.toLocaleString()],
        ["Today's Leads", data.todayLeads.toString()],
        ["Weekly Leads", data.weeklyLeads.toString()],
        ["Monthly Leads", data.monthlyLeads.toString()],
        ["Conversion Rate", `${data.conversionRate}%`],
        ["Avg Response Time", `${data.avgResponseTime}m`],
    ];

    const colWidth = 60;
    let col = 0;
    metrics.forEach(([label, value]) => {
        const xPos = 20 + col * colWidth;
        pdf.setTextColor(100, 100, 100);
        pdf.text(label, xPos, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.text(value, xPos, yPosition + 5);
        pdf.setFontSize(10);

        col++;
        if (col >= 3) {
            col = 0;
            yPosition += 12;
        }
    });

    if (col !== 0) yPosition += 12;
    yPosition += 5;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
    }

    // Leads by Source
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Leads by Source", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    data.leadsBySource.slice(0, 8).forEach((item) => {
        pdf.setTextColor(100, 100, 100);
        pdf.text(item.source, 20, yPosition);
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.count.toString(), 80, yPosition);
        const trendColor: [number, number, number] = item.trend >= 0 ? [16, 185, 129] : [239, 68, 68];
        pdf.setTextColor(trendColor[0], trendColor[1], trendColor[2]);
        pdf.text(`${item.trend >= 0 ? "+" : ""}${item.trend}%`, 110, yPosition);
        yPosition += 6;
    });

    yPosition += 5;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
    }

    // Channel Performance
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Channel Performance", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Channel", 20, yPosition);
    pdf.text("Leads", 80, yPosition);
    pdf.text("Conversions", 110, yPosition);
    pdf.text("Rate", 150, yPosition);
    yPosition += 6;

    pdf.setTextColor(0, 0, 0);
    data.channelPerformance.slice(0, 10).forEach((item) => {
        pdf.text(item.channel, 20, yPosition);
        pdf.text(item.leads.toString(), 80, yPosition);
        pdf.text(item.conversions.toString(), 110, yPosition);
        pdf.text(`${item.conversionRate}%`, 150, yPosition);
        yPosition += 6;
    });

    // Try to capture charts if possible
    try {
        const chartsContainer = document.getElementById("charts-for-export");
        if (chartsContainer && yPosition < pageHeight - 100) {
            pdf.addPage();
            yPosition = 20;
            pdf.setFontSize(14);
            pdf.text("Visual Analytics", 20, yPosition);
            yPosition += 10;

            const canvas = await html2canvas(chartsContainer, {
                scale: 2,
                logging: false,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pageWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (imgHeight < pageHeight - yPosition - 20) {
                pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
            }
        }
    } catch (error) {
        console.warn("Could not capture charts:", error);
    }

    // Save PDF
    pdf.save(`${filename}-${Date.now()}.pdf`);
};
