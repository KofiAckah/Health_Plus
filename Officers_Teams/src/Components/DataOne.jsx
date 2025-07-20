import React from "react";
import { TrendingUp } from "lucide-react";

// Import UI components using relative paths to avoid alias issues
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function DataOne() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dashboard Overview</CardTitle>
        <CardDescription>System Statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="p-4 text-center">
          <p className="text-2xl font-bold">Dashboard Content</p>
          <p className="text-muted-foreground">Chart will be displayed here</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          System operational <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Real-time monitoring active
        </div>
      </CardFooter>
    </Card>
  );
}

export default DataOne;
