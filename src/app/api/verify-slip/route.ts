import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'No image provided or invalid file type' },
                { status: 400 }
            );
        }

        // Prepare FormData for EasySlip
        const easySlipFormData = new FormData();

        // IMPORTANT: specific handling to ensure file is sent correctly as a file
        const buffer = Buffer.from(await file.arrayBuffer());
        // Ensure we provide a filename and type
        const filename = (file as any).name || 'slip.jpg';
        const type = file.type || 'image/jpeg';

        // Based on EasySlip documentation example: formData.append('file', fs.createReadStream('IMAGE_PATH'))
        // The key must be 'file', not 'image'.
        easySlipFormData.append('file', new Blob([buffer], { type }), filename);

        console.log(`Sending multipart/form-data request to EasySlip API with field 'file': ${filename}`);

        const apiKey = process.env.EASYSLIP_API_KEY || '8b7f25cd-ca4a-4b67-8050-8c7290157b94';

        const response = await fetch('https://developer.easyslip.com/api/v1/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                // Note: Do NOT set Content-Type header manually.
                // fetch will set 'multipart/form-data; boundary=---' automatically
            },
            body: easySlipFormData,
        });

        const data = await response.json();

        console.log('EasySlip Response Status:', response.status);

        if (response.status === 200) {
            // Some APIs return 200 even for logical failures, check data.status
            // Adjust this check based on actual successful response structure if needed.
            // If data.status is the HTTP status code from their end, 200 is good.
            if (data.status === 200) {
                return NextResponse.json({
                    success: true,
                    message: 'โอนเงินสำเร็จ',
                    data: data.data
                });
            } else {
                // API returned 200 but logical error inside
                console.log('EasySlip Logical Error:', JSON.stringify(data, null, 2));
                return NextResponse.json({
                    success: false,
                    message: data.data?.message || data.status?.message || 'สลิปไม่ถูกต้อง',
                    details: data
                }, { status: 400 });
            }
        } else {
            const apiMessage = data.message || data.status?.message || 'สลิปไม่ถูกต้อง หรือตรวจสอบไม่ผ่าน';
            console.log('EasySlip Error Detail:', JSON.stringify(data, null, 2));

            return NextResponse.json({
                success: false,
                message: apiMessage,
                details: data
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Slip verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error during verification', details: error.message },
            { status: 500 }
        );
    }
}
