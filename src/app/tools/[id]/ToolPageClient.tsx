"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SeoContentBlock } from "@/components/SeoContentBlock";

const PasswordGeneratorBody = dynamic(() => import('@/components/tools/PasswordGeneratorBody').then(mod => mod.PasswordGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const JsonFormatterBody = dynamic(() => import('@/components/tools/JsonFormatterBody').then(mod => mod.JsonFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const Base64ToolBody = dynamic(() => import('@/components/tools/Base64ToolBody').then(mod => mod.Base64ToolBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const UrlEncodeToolBody = dynamic(() => import('@/components/tools/UrlEncodeToolBody').then(mod => mod.UrlEncodeToolBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const UuidGeneratorBody = dynamic(() => import('@/components/tools/UuidGeneratorBody').then(mod => mod.UuidGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MarkdownToHtmlBody = dynamic(() => import('@/components/tools/MarkdownToHtmlBody').then(mod => mod.MarkdownToHtmlBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const JsFormatterBody = dynamic(() => import('@/components/tools/JsFormatterBody').then(mod => mod.JsFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const HtmlFormatterBody = dynamic(() => import('@/components/tools/HtmlFormatterBody').then(mod => mod.HtmlFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CssFormatterBody = dynamic(() => import('@/components/tools/CssFormatterBody').then(mod => mod.CssFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const XmlFormatterBody = dynamic(() => import('@/components/tools/XmlFormatterBody').then(mod => mod.XmlFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SqlFormatterBody = dynamic(() => import('@/components/tools/SqlFormatterBody').then(mod => mod.SqlFormatterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WordCounterBody = dynamic(() => import('@/components/tools/WordCounterBody').then(mod => mod.WordCounterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CaseConverterBody = dynamic(() => import('@/components/tools/CaseConverterBody').then(mod => mod.CaseConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RemoveDuplicatesBody = dynamic(() => import('@/components/tools/RemoveDuplicatesBody').then(mod => mod.RemoveDuplicatesBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SortLinesBody = dynamic(() => import('@/components/tools/SortLinesBody').then(mod => mod.SortLinesBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const LoremIpsumBody = dynamic(() => import('@/components/tools/LoremIpsumBody').then(mod => mod.LoremIpsumBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const StrengthCheckerBody = dynamic(() => import('@/components/tools/StrengthCheckerBody').then(mod => mod.StrengthCheckerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AesEncryptBody = dynamic(() => import('@/components/tools/AesEncryptBody').then(mod => mod.AesEncryptBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const HashGeneratorBody = dynamic(() => import('@/components/tools/HashGeneratorBody').then(mod => mod.HashGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const IpAddressBody = dynamic(() => import('@/components/tools/IpAddressBody').then(mod => mod.IpAddressBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const Base64ImageBody = dynamic(() => import('@/components/tools/Base64ImageBody').then(mod => mod.Base64ImageBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ColorPickerBody = dynamic(() => import('@/components/tools/ColorPickerBody').then(mod => mod.ColorPickerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ImageResizerBody = dynamic(() => import('@/components/tools/ImageResizerBody').then(mod => mod.ImageResizerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SvgToPngBody = dynamic(() => import('@/components/tools/SvgToPngBody').then(mod => mod.SvgToPngBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const JsonToCsvBody = dynamic(() => import('@/components/tools/JsonToCsvBody').then(mod => mod.JsonToCsvBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CsvToJsonBody = dynamic(() => import('@/components/tools/CsvToJsonBody').then(mod => mod.CsvToJsonBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const YamlToJsonBody = dynamic(() => import('@/components/tools/YamlToJsonBody').then(mod => mod.YamlToJsonBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const XmlToJsonBody = dynamic(() => import('@/components/tools/XmlToJsonBody').then(mod => mod.XmlToJsonBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const PercentageCalculatorBody = dynamic(() => import('@/components/tools/PercentageCalculatorBody').then(mod => mod.PercentageCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RoiCalculatorBody = dynamic(() => import('@/components/tools/RoiCalculatorBody').then(mod => mod.RoiCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MarginCalculatorBody = dynamic(() => import('@/components/tools/MarginCalculatorBody').then(mod => mod.MarginCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RuleOf72Body = dynamic(() => import('@/components/tools/RuleOf72Body').then(mod => mod.RuleOf72Body), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MortgageCalcBody = dynamic(() => import('@/components/tools/MortgageCalcBody').then(mod => mod.MortgageCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AutoLoanCalcBody = dynamic(() => import('@/components/tools/AutoLoanCalcBody').then(mod => mod.AutoLoanCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SalaryConverterBody = dynamic(() => import('@/components/tools/SalaryConverterBody').then(mod => mod.SalaryConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const TipCalcBody = dynamic(() => import('@/components/tools/TipCalcBody').then(mod => mod.TipCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CompoundInterestBody = dynamic(() => import('@/components/tools/CompoundInterestBody').then(mod => mod.CompoundInterestBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const LineBreakGenBody = dynamic(() => import('@/components/tools/LineBreakGenBody').then(mod => mod.LineBreakGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MetaTagGenBody = dynamic(() => import('@/components/tools/MetaTagGenBody').then(mod => mod.MetaTagGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RobotsTxtGenBody = dynamic(() => import('@/components/tools/RobotsTxtGenBody').then(mod => mod.RobotsTxtGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CssMinifierBody = dynamic(() => import('@/components/tools/CssMinifierBody').then(mod => mod.CssMinifierBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RandomNumberBody = dynamic(() => import('@/components/tools/RandomNumberBody').then(mod => mod.RandomNumberBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DiceRollerBody = dynamic(() => import('@/components/tools/DiceRollerBody').then(mod => mod.DiceRollerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const FakeDataGenBody = dynamic(() => import('@/components/tools/FakeDataGenBody').then(mod => mod.FakeDataGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SubnetCalcBody = dynamic(() => import('@/components/tools/SubnetCalcBody').then(mod => mod.SubnetCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BmiCalcBody = dynamic(() => import('@/components/tools/BmiCalcBody').then(mod => mod.BmiCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BmrCalcBody = dynamic(() => import('@/components/tools/BmrCalcBody').then(mod => mod.BmrCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MacroCalcBody = dynamic(() => import('@/components/tools/MacroCalcBody').then(mod => mod.MacroCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BacCalcBody = dynamic(() => import('@/components/tools/BacCalcBody').then(mod => mod.BacCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ScreenResolutionBody = dynamic(() => import('@/components/tools/ScreenResolutionBody').then(mod => mod.ScreenResolutionBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DeviceInfoBody = dynamic(() => import('@/components/tools/DeviceInfoBody').then(mod => mod.DeviceInfoBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BatteryCalcBody = dynamic(() => import('@/components/tools/BatteryCalcBody').then(mod => mod.BatteryCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const HtmlEntitiesBody = dynamic(() => import('@/components/tools/HtmlEntitiesBody').then(mod => mod.HtmlEntitiesBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DiffCheckerBody = dynamic(() => import('@/components/tools/DiffCheckerBody').then(mod => mod.DiffCheckerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const RegexTesterBody = dynamic(() => import('@/components/tools/RegexTesterBody').then(mod => mod.RegexTesterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MergePdfBody = dynamic(() => import('@/components/tools/MergePdfBody').then(mod => mod.MergePdfBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SplitPdfBody = dynamic(() => import('@/components/tools/SplitPdfBody').then(mod => mod.SplitPdfBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ProtectPdfBody = dynamic(() => import('@/components/tools/ProtectPdfBody').then(mod => mod.ProtectPdfBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SignatureGenBody = dynamic(() => import('@/components/tools/SignatureGenBody').then(mod => mod.SignatureGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const LiveMarkdownBody = dynamic(() => import('@/components/tools/LiveMarkdownBody').then(mod => mod.LiveMarkdownBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WebpToPngJpgBody = dynamic(() => import('@/components/tools/WebpToPngJpgBody').then(mod => mod.WebpToPngJpgBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AddWatermarkBody = dynamic(() => import('@/components/tools/AddWatermarkBody').then(mod => mod.AddWatermarkBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const PaletteGenBody = dynamic(() => import('@/components/tools/PaletteGenBody').then(mod => mod.PaletteGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const IcoGeneratorBody = dynamic(() => import('@/components/tools/IcoGeneratorBody').then(mod => mod.IcoGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const UnitConverterBody = dynamic(() => import('@/components/tools/UnitConverterBody').then(mod => mod.UnitConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const UnixTimestampBody = dynamic(() => import('@/components/tools/UnixTimestampBody').then(mod => mod.UnixTimestampBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DaysBetweenBody = dynamic(() => import('@/components/tools/DaysBetweenBody').then(mod => mod.DaysBetweenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const TimezoneConvBody = dynamic(() => import('@/components/tools/TimezoneConvBody').then(mod => mod.TimezoneConvBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });


const CurrencyConverterBody = dynamic(() => import('@/components/tools/CurrencyConverterBody').then(mod => mod.CurrencyConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CryptoTrackerBody = dynamic(() => import('@/components/tools/CryptoTrackerBody').then(mod => mod.CryptoTrackerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MacLookupBody = dynamic(() => import('@/components/tools/MacLookupBody').then(mod => mod.MacLookupBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DnsLookupBody = dynamic(() => import('@/components/tools/DnsLookupBody').then(mod => mod.DnsLookupBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WhoisLookupBody = dynamic(() => import('@/components/tools/WhoisLookupBody').then(mod => mod.WhoisLookupBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WeatherDashboardBody = dynamic(() => import('@/components/tools/WeatherDashboardBody').then(mod => mod.WeatherDashboardBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CountryInfoBody = dynamic(() => import('@/components/tools/CountryInfoBody').then(mod => mod.CountryInfoBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const HolidaysFinderBody = dynamic(() => import('@/components/tools/HolidaysFinderBody').then(mod => mod.HolidaysFinderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const DictionaryBody = dynamic(() => import('@/components/tools/DictionaryBody').then(mod => mod.DictionaryBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const GithubProfileBody = dynamic(() => import('@/components/tools/GithubProfileBody').then(mod => mod.GithubProfileBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const NpmExplorerBody = dynamic(() => import('@/components/tools/NpmExplorerBody').then(mod => mod.NpmExplorerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ApiTesterBody = dynamic(() => import('@/components/tools/ApiTesterBody').then(mod => mod.ApiTesterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const QuoteGeneratorBody = dynamic(() => import('@/components/tools/QuoteGeneratorBody').then(mod => mod.QuoteGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const JokeGeneratorBody = dynamic(() => import('@/components/tools/JokeGeneratorBody').then(mod => mod.JokeGeneratorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AnimalPictureBody = dynamic(() => import('@/components/tools/AnimalPictureBody').then(mod => mod.AnimalPictureBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });

const ResistorCalculatorBody = dynamic(() => import('@/components/tools/ResistorCalculatorBody').then(mod => mod.ResistorCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const OhmsLawBody = dynamic(() => import('@/components/tools/OhmsLawBody').then(mod => mod.OhmsLawBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AwgConverterBody = dynamic(() => import('@/components/tools/AwgConverterBody').then(mod => mod.AwgConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const VinDecoderBody = dynamic(() => import('@/components/tools/VinDecoderBody').then(mod => mod.VinDecoderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CarModelLookupBody = dynamic(() => import('@/components/tools/CarModelLookupBody').then(mod => mod.CarModelLookupBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const FuelCostCalculatorBody = dynamic(() => import('@/components/tools/FuelCostCalculatorBody').then(mod => mod.FuelCostCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const AqiRadarBody = dynamic(() => import('@/components/tools/AqiRadarBody').then(mod => mod.AqiRadarBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CarbonFootprintBody = dynamic(() => import('@/components/tools/CarbonFootprintBody').then(mod => mod.CarbonFootprintBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SunlightCalculatorBody = dynamic(() => import('@/components/tools/SunlightCalculatorBody').then(mod => mod.SunlightCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BarcodeScannerBody = dynamic(() => import('@/components/tools/BarcodeScannerBody').then(mod => mod.BarcodeScannerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const IsItDownBody = dynamic(() => import('@/components/tools/IsItDownBody').then(mod => mod.IsItDownBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WhatIsMyIpBody = dynamic(() => import('@/components/tools/WhatIsMyIpBody').then(mod => mod.WhatIsMyIpBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BrowserFingerprintBody = dynamic(() => import('@/components/tools/BrowserFingerprintBody').then(mod => mod.BrowserFingerprintBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const MacroCalculatorBody = dynamic(() => import('@/components/tools/MacroCalculatorBody').then(mod => mod.MacroCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BmiCalculatorBody = dynamic(() => import('@/components/tools/BmiCalculatorBody').then(mod => mod.BmiCalculatorBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const JwtDecoderBody = dynamic(() => import('@/components/tools/JwtDecoderBody').then(mod => mod.JwtDecoderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const GlassmorphismGenBody = dynamic(() => import('@/components/tools/GlassmorphismGenBody').then(mod => mod.GlassmorphismGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const BoxShadowGenBody = dynamic(() => import('@/components/tools/BoxShadowGenBody').then(mod => mod.BoxShadowGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CssClipPathBody = dynamic(() => import('@/components/tools/CssClipPathBody').then(mod => mod.CssClipPathBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SvgBlobGenBody = dynamic(() => import('@/components/tools/SvgBlobGenBody').then(mod => mod.SvgBlobGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const TypeScaleCalcBody = dynamic(() => import('@/components/tools/TypeScaleCalcBody').then(mod => mod.TypeScaleCalcBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });

const UtmLinkBuilderBody = dynamic(() => import('@/components/tools/UtmLinkBuilderBody').then(mod => mod.UtmLinkBuilderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SlugConverterBody = dynamic(() => import('@/components/tools/SlugConverterBody').then(mod => mod.SlugConverterBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const PomodoroTimerBody = dynamic(() => import('@/components/tools/PomodoroTimerBody').then(mod => mod.PomodoroTimerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const SeoSerpPreviewBody = dynamic(() => import('@/components/tools/SeoSerpPreviewBody').then(mod => mod.SeoSerpPreviewBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const EmailSignatureGenBody = dynamic(() => import('@/components/tools/EmailSignatureGenBody').then(mod => mod.EmailSignatureGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const LocalKanbanBody = dynamic(() => import('@/components/tools/LocalKanbanBody').then(mod => mod.LocalKanbanBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const CronJobGenBody = dynamic(() => import('@/components/tools/CronJobGenBody').then(mod => mod.CronJobGenBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });

const ScreenRecorderBody = dynamic(() => import('@/components/tools/ScreenRecorderBody').then(mod => mod.ScreenRecorderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const WebcamSnapshotBody = dynamic(() => import('@/components/tools/WebcamSnapshotBody').then(mod => mod.WebcamSnapshotBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const VoiceRecorderBody = dynamic(() => import('@/components/tools/VoiceRecorderBody').then(mod => mod.VoiceRecorderBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });

const SqliteViewerBody = dynamic(() => import('@/components/tools/SqliteViewerBody').then(mod => mod.SqliteViewerBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const TextToSpeechBody = dynamic(() => import('@/components/tools/TextToSpeechBody').then(mod => mod.TextToSpeechBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });
const ImageFilterStudioBody = dynamic(() => import('@/components/tools/ImageFilterStudioBody').then(mod => mod.ImageFilterStudioBody), { ssr: false, loading: () => <div className="animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl h-[60vh] w-full border border-slate-200/50 dark:border-slate-700/50"></div> });

interface ToolPageClientProps {
  tool: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    isBeta?: boolean;
    isNew?: boolean;
  };
  toolId: string;
  categoryTitle?: string;
}

export function ToolPageClient({ tool, toolId, categoryTitle }: ToolPageClientProps) {
  const router = useRouter();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  const renderToolBody = () => {
    if (toolId.includes("password-generator") || toolId.includes("password")) return <PasswordGeneratorBody />;
    if (toolId.includes("json-formatter")) return <JsonFormatterBody />;
    if (toolId.includes("base64-image")) return <Base64ImageBody />;
    if (toolId.includes("base64")) return <Base64ToolBody />;
    if (toolId.includes("url-encode")) return <UrlEncodeToolBody />;
    if (toolId.includes("uuid")) return <UuidGeneratorBody />;
    if (toolId.includes("markdown")) return <MarkdownToHtmlBody />;
    if (toolId.includes("js-formatter")) return <JsFormatterBody />;
    if (toolId.includes("html-formatter")) return <HtmlFormatterBody />;
    if (toolId.includes("css-formatter")) return <CssFormatterBody />;
    if (toolId.includes("xml-formatter")) return <XmlFormatterBody />;
    if (toolId.includes("sql-formatter")) return <SqlFormatterBody />;
    if (toolId.includes("word-char")) return <WordCounterBody />;
    if (toolId.includes("case-converter")) return <CaseConverterBody />;
    if (toolId.includes("remove-duplicates")) return <RemoveDuplicatesBody />;
    if (toolId.includes("sort-lines")) return <SortLinesBody />;
    if (toolId.includes("lorem-ipsum")) return <LoremIpsumBody />;
    if (toolId.includes("strength-checker")) return <StrengthCheckerBody />;
    if (toolId.includes("aes-encrypt")) return <AesEncryptBody />;
    if (toolId.includes("hash-generator")) return <HashGeneratorBody />;
    if (toolId.includes("my-ip-address")) return <IpAddressBody />;
    if (toolId.includes("color-picker")) return <ColorPickerBody />;
    if (toolId.includes("image-resizer")) return <ImageResizerBody />;
    if (toolId.includes("svg-to-png")) return <SvgToPngBody />;
    if (toolId.includes("json-to-csv")) return <JsonToCsvBody />;
    if (toolId.includes("csv-to-json")) return <CsvToJsonBody />;
    if (toolId.includes("yaml-to-json")) return <YamlToJsonBody />;
    if (toolId.includes("xml-to-json")) return <XmlToJsonBody />;
    if (toolId.includes("percentage-calc")) return <PercentageCalculatorBody />;
    if (toolId.includes("roi-calculator")) return <RoiCalculatorBody />;
    if (toolId.includes("margin-calc")) return <MarginCalculatorBody />;
    if (toolId.includes("rule-of-72")) return <RuleOf72Body />;
    if (toolId.includes("mortgage-calc")) return <MortgageCalcBody />;
    if (toolId.includes("auto-loan")) return <AutoLoanCalcBody />;
    if (toolId.includes("salary-conv")) return <SalaryConverterBody />;
    if (toolId.includes("tip-calc")) return <TipCalcBody />;
    if (toolId.includes("compound-int")) return <CompoundInterestBody />;
    if (toolId.includes("bmi-calculator")) return <BmiCalculatorBody />;
    if (toolId.includes("bmr")) return <BmrCalcBody />;
    if (toolId.includes("macro-calc")) return <MacroCalculatorBody />;
    if (toolId.includes("bac-calc")) return <BacCalcBody />;
    if (toolId.includes("meta-tag")) return <MetaTagGenBody />;
    if (toolId.includes("css-minifier")) return <CssMinifierBody />;
    if (toolId.includes("robots-txt")) return <RobotsTxtGenBody />;
    if (toolId.includes("line-break")) return <LineBreakGenBody />;
    if (toolId.includes("random-number")) return <RandomNumberBody />;
    if (toolId.includes("dice-roller")) return <DiceRollerBody />;
    if (toolId.includes("fake-data")) return <FakeDataGenBody />;
    if (toolId.includes("subnet-calc")) return <SubnetCalcBody />;
    if (toolId.includes("screen-res")) return <ScreenResolutionBody />;
    if (toolId.includes("device-info")) return <DeviceInfoBody />;
    if (toolId.includes("battery-calc")) return <BatteryCalcBody />;

    // New 16 Tools
    if (toolId.includes("html-entities")) return <HtmlEntitiesBody />;
    if (toolId.includes("diff-checker")) return <DiffCheckerBody />;
    if (toolId.includes("regex-tester")) return <RegexTesterBody />;
    if (toolId.includes("merge-pdf")) return <MergePdfBody />;
    if (toolId.includes("split-pdf")) return <SplitPdfBody />;
    if (toolId.includes("password-protect")) return <ProtectPdfBody />;
    if (toolId.includes("signature-gen")) return <SignatureGenBody />;
    if (toolId.includes("live-markdown")) return <LiveMarkdownBody />;
    if (toolId.includes("webp-to-png-jpg")) return <WebpToPngJpgBody />;
    if (toolId.includes("add-watermark")) return <AddWatermarkBody />;
    if (toolId.includes("palette-gen")) return <PaletteGenBody />;
    if (toolId.includes("ico-generator")) return <IcoGeneratorBody />;
    if (toolId.includes("unit-converter")) return <UnitConverterBody />;
    if (toolId.includes("unix-timestamp")) return <UnixTimestampBody />;
    if (toolId.includes("days-between")) return <DaysBetweenBody />;
    if (toolId.includes("timezone-conv")) return <TimezoneConvBody />;
    

    if (toolId.includes("currency-conv")) return <CurrencyConverterBody />;
    if (toolId.includes("crypto-tracker")) return <CryptoTrackerBody />;
    if (toolId.includes("mac-lookup")) return <MacLookupBody />;
    if (toolId.includes("dns-lookup")) return <DnsLookupBody />;
    if (toolId.includes("whois-lookup")) return <WhoisLookupBody />;
    if (toolId.includes("weather-dash")) return <WeatherDashboardBody />;
    if (toolId.includes("country-info")) return <CountryInfoBody />;
    if (toolId.includes("public-holidays")) return <HolidaysFinderBody />;
    if (toolId.includes("dictionary")) return <DictionaryBody />;
    if (toolId.includes("github-profile")) return <GithubProfileBody />;
    if (toolId.includes("npm-explorer")) return <NpmExplorerBody />;
    if (toolId.includes("api-tester")) return <ApiTesterBody />;
    if (toolId.includes("quote-gen")) return <QuoteGeneratorBody />;
    if (toolId.includes("joke-gen")) return <JokeGeneratorBody />;
    if (toolId.includes("animal-pics")) return <AnimalPictureBody />;

    
    // New 15 niche tools
    if (toolId.includes("resistor-calc")) return <ResistorCalculatorBody />;
    if (toolId.includes("ohm-s-law")) return <OhmsLawBody />;
    if (toolId.includes("awg-converter")) return <AwgConverterBody />;
    if (toolId.includes("vin-decoder")) return <VinDecoderBody />;
    if (toolId.includes("car-models")) return <CarModelLookupBody />;
    if (toolId.includes("fuel-cost")) return <FuelCostCalculatorBody />;
    if (toolId.includes("aqi-radar")) return <AqiRadarBody />;
    if (toolId.includes("carbon-footprint")) return <CarbonFootprintBody />;
    if (toolId.includes("sunlight-calc")) return <SunlightCalculatorBody />;
    if (toolId.includes("barcode-scanner")) return <BarcodeScannerBody />;
    if (toolId.includes("is-it-down")) return <IsItDownBody />;
    if (toolId.includes("what-is-my-ip")) return <WhatIsMyIpBody />;
    if (toolId.includes("browser-fingerprint")) return <BrowserFingerprintBody />;

    // Phase 1 UI Generators
    if (toolId.includes("jwt-decoder")) return <JwtDecoderBody />;
    if (toolId.includes("glassmorphism-gen")) return <GlassmorphismGenBody />;
    if (toolId.includes("box-shadow-gen")) return <BoxShadowGenBody />;
    if (toolId.includes("css-clip-path")) return <CssClipPathBody />;
    if (toolId.includes("svg-blob-gen")) return <SvgBlobGenBody />;
    if (toolId.includes("type-scale-calc")) return <TypeScaleCalcBody />;

    // Phase 2 Marketing & Productivity
    if (toolId.includes("utm-link-builder")) return <UtmLinkBuilderBody />;
    if (toolId.includes("slug-converter")) return <SlugConverterBody />;
    if (toolId.includes("pomodoro-timer")) return <PomodoroTimerBody />;
    if (toolId.includes("seo-serp-preview")) return <SeoSerpPreviewBody />;
    if (toolId.includes("email-signature-gen")) return <EmailSignatureGenBody />;
    if (toolId.includes("local-kanban")) return <LocalKanbanBody />;
    if (toolId.includes("cron-job-gen")) return <CronJobGenBody />;

    // Phase 3 Media Capture
    if (toolId.includes("screen-recorder")) return <ScreenRecorderBody />;
    if (toolId.includes("webcam-snapshot")) return <WebcamSnapshotBody />;
    if (toolId.includes("voice-recorder")) return <VoiceRecorderBody />;

    // Phase 4 Advanced Computation
    if (toolId.includes("sqlite-viewer")) return <SqliteViewerBody />;
    if (toolId.includes("text-to-speech")) return <TextToSpeechBody />;
    if (toolId.includes("image-filter-studio")) return <ImageFilterStudioBody />;

    // Default fallback
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 dark:text-slate-400">
        <div className={`mb-6 ${tool.iconColor} opacity-50 scale-150`}>{tool.icon}</div>
        <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Tool Under Construction</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center">The {tool.title} interface is currently being built. Check back soon!</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 mb-8 mt-2">
        <div className="flex items-center gap-5">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-white/10 ${tool.iconColor}`}>
              <div className="scale-125 drop-shadow-sm">
                {tool.icon}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {tool.title}
                </h1>
                {tool.isBeta && <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-100/50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">BETA</span>}
                {tool.isNew && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">NEW</span>}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {tool.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Body Container */}
      <div className="bg-white/70 dark:bg-[#0B1120]/40 backdrop-blur-3xl rounded-[2rem] shadow-2xl dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] border border-white/60 dark:border-white/5 p-6 md:p-10 min-h-[60vh] ring-1 ring-black/5 dark:ring-white/5">
        {renderToolBody()}
      </div>

      <SeoContentBlock title={tool.title} subtitle={tool.subtitle} categoryTitle={categoryTitle} />
    </div>
  );
}
