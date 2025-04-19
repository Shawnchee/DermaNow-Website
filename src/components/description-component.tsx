import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Leaf, Building } from "lucide-react";
import { ReactNode } from "react";

type ImpactItem = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

type TimelineStep = {
  step: number;
  color: string;
  title: string;
  desc: string;
};

type DetailedProjectDescriptionProps = {
  title: string;
  description: string;
  overview: string[];
  objectives: string[];
  impactStats: ImpactItem[];
  timeline: TimelineStep[];
  buttonLabel?: string;
};

export const DetailedProjectDescription = ({
  title,
  description,
  overview,
  objectives,
  impactStats,
  timeline,
}: DetailedProjectDescriptionProps) => {
  return (
    <div className="mb-12">
      <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">
                Project Overview
              </h3>
              {overview.map((para, idx) => (
                <p key={idx} className="text-gray-700">
                  {para}
                </p>
              ))}

              <h3 className="text-lg font-semibold text-blue-700 mt-6">
                Key Objectives
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Project Impact
                </h3>
                <div className="space-y-3">
                  {impactStats.map((item, idx) => (
                    <div className="flex items-center gap-3" key={idx}>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Project Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-blue-200"></div>

              <div className="space-y-6">
                {timeline.map((step) => (
                  <div className="flex gap-4" key={step.step}>
                    <div
                      className={`h-8 w-8 rounded-full ${step.color} z-10 flex items-center justify-center text-white text-sm`}
                    >
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedProjectDescription;
