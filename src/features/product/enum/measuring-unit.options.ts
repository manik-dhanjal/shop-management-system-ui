import { DropdownOption } from "@shared/components/form/dropdown-controlled.component";
import { MeasuringUnit } from "./measuring-unit.enum";

export const MEASURING_UNIT_OPTIONS: DropdownOption<string>[] = [
  { label: `${MeasuringUnit.PIECES} (pcs)`, value: MeasuringUnit.PIECES },
  { label: `${MeasuringUnit.UNIT} (unit)`, value: MeasuringUnit.UNIT },
  { label: `${MeasuringUnit.ITEM} (item)`, value: MeasuringUnit.ITEM },
  { label: `${MeasuringUnit.PAIR} (pair)`, value: MeasuringUnit.PAIR },
  { label: `${MeasuringUnit.SET} (set)`, value: MeasuringUnit.SET },
  { label: `${MeasuringUnit.DOZEN} (dozen)`, value: MeasuringUnit.DOZEN },
  { label: `${MeasuringUnit.PACK} (pack)`, value: MeasuringUnit.PACK },
  { label: `${MeasuringUnit.BOX} (box)`, value: MeasuringUnit.BOX },
  { label: `${MeasuringUnit.CARTON} (carton)`, value: MeasuringUnit.CARTON },
  { label: `${MeasuringUnit.TRAY} (tray)`, value: MeasuringUnit.TRAY },
  { label: `${MeasuringUnit.PALLET} (pallet)`, value: MeasuringUnit.PALLET },

  { label: `${MeasuringUnit.KILOGRAM} (kg)`, value: MeasuringUnit.KILOGRAM },
  { label: `${MeasuringUnit.GRAM} (g)`, value: MeasuringUnit.GRAM },
  { label: `${MeasuringUnit.MILLIGRAM} (mg)`, value: MeasuringUnit.MILLIGRAM },
  { label: `${MeasuringUnit.TONNE} (tonne)`, value: MeasuringUnit.TONNE },
  { label: `${MeasuringUnit.POUND} (lb)`, value: MeasuringUnit.POUND },
  { label: `${MeasuringUnit.OUNCE} (oz)`, value: MeasuringUnit.OUNCE },

  { label: `${MeasuringUnit.LITRE} (ltr)`, value: MeasuringUnit.LITRE },
  {
    label: `${MeasuringUnit.MILLILITRE} (ml)`,
    value: MeasuringUnit.MILLILITRE,
  },
  {
    label: `${MeasuringUnit.FLUID_OUNCE} (fl oz)`,
    value: MeasuringUnit.FLUID_OUNCE,
  },
  { label: `${MeasuringUnit.PINT} (pint)`, value: MeasuringUnit.PINT },
  { label: `${MeasuringUnit.QUART} (quart)`, value: MeasuringUnit.QUART },
  { label: `${MeasuringUnit.GALLON} (gallon)`, value: MeasuringUnit.GALLON },
  {
    label: `${MeasuringUnit.CUBIC_METER} (cbm)`,
    value: MeasuringUnit.CUBIC_METER,
  },

  { label: `${MeasuringUnit.METER} (m)`, value: MeasuringUnit.METER },
  {
    label: `${MeasuringUnit.CENTIMETER} (cm)`,
    value: MeasuringUnit.CENTIMETER,
  },
  {
    label: `${MeasuringUnit.MILLIMETER} (mm)`,
    value: MeasuringUnit.MILLIMETER,
  },
  { label: `${MeasuringUnit.INCH} (in)`, value: MeasuringUnit.INCH },
  { label: `${MeasuringUnit.FOOT} (ft)`, value: MeasuringUnit.FOOT },
  { label: `${MeasuringUnit.YARD} (yd)`, value: MeasuringUnit.YARD },
  {
    label: `${MeasuringUnit.SQUARE_METER} (sqm)`,
    value: MeasuringUnit.SQUARE_METER,
  },
  {
    label: `${MeasuringUnit.SQUARE_FOOT} (sqft)`,
    value: MeasuringUnit.SQUARE_FOOT,
  },

  { label: `${MeasuringUnit.TABLET} (tablet)`, value: MeasuringUnit.TABLET },
  { label: `${MeasuringUnit.CAPSULE} (capsule)`, value: MeasuringUnit.CAPSULE },
  { label: `${MeasuringUnit.STRIP} (strip)`, value: MeasuringUnit.STRIP },
  { label: `${MeasuringUnit.AMPOULE} (ampoule)`, value: MeasuringUnit.AMPOULE },
  { label: `${MeasuringUnit.VIAL} (vial)`, value: MeasuringUnit.VIAL },
  { label: `${MeasuringUnit.BOTTLE} (bottle)`, value: MeasuringUnit.BOTTLE },

  { label: `${MeasuringUnit.TUBE} (tube)`, value: MeasuringUnit.TUBE },
  { label: `${MeasuringUnit.BAR} (bar)`, value: MeasuringUnit.BAR },
  { label: `${MeasuringUnit.SHEET} (sheet)`, value: MeasuringUnit.SHEET },

  { label: `${MeasuringUnit.OTHER} (other)`, value: MeasuringUnit.OTHER },
];
