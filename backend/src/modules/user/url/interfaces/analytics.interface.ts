export interface AggregatedClickData {
    _id: {
        year: number;
        month?: number;
        day?: number;
    };
    count: number;
}

export interface ChartDataPoint {
    date: string;
    label: string;
    clicks: number;
}
