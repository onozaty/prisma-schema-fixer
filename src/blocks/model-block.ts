import { Block } from "./block";

export class ModelBlock implements Block {
  private lines: Line[] = [];

  constructor(lines?: string[]) {
    if (lines !== undefined) {
      for (const line of lines) {
        this.appendLine(line);
      }
    }
  }

  appendLine(line: string): void {
    if (this.lines.length === 0) {
      this.lines.push(new StartLine(line));
    } else {
      this.lines.push(parseLine(line));
    }
  }
  getLines(): string[] {
    return this.lines.map((line) => line.toString());
  }
  isEmpty(): boolean {
    return this.lines.length === 0;
  }

  getModelName(): string {
    const startLine = this.lines[0] as StartLine;
    return startLine.modelName;
  }
  setModelName(name: string): void {
    const startLine = this.lines[0] as StartLine;
    startLine.modelName = name;
  }

  getMap(): string | undefined {
    const mapLine = this.lines.find(
      (line): line is MapLine => line instanceof MapLine,
    );
    return mapLine?.map;
  }
  setMap(map: string | undefined): void {
    let mapLine = this.lines.find(
      (line): line is MapLine => line instanceof MapLine,
    );

    if (mapLine === undefined) {
      if (map === undefined) {
        return;
      }
      mapLine = new MapLine();
      // insert map line before the last line
      this.lines.splice(this.lines.length - 1, 0, mapLine);
    }
    mapLine.map = map;
  }

  getFieldLines(): FieldLine[] {
    return this.lines
      .filter((line): line is FieldLine => line instanceof FieldLine)
      .map((line) => line);
  }
  getIdLine(): IdLine | undefined {
    return this.lines.find((line): line is IdLine => line instanceof IdLine);
  }
  getUniqueLines(): UniqueLine[] {
    return this.lines.filter(
      (line): line is UniqueLine => line instanceof UniqueLine,
    );
  }
  getIndexLines(): IndexLine[] {
    return this.lines.filter(
      (line): line is IndexLine => line instanceof IndexLine,
    );
  }

  static filter(blocks: Block[]): ModelBlock[] {
    return blocks.filter(
      (block): block is ModelBlock => block instanceof ModelBlock,
    );
  }
}

export const PRIMITIVE_TYPES: string[] = [
  "String",
  "Boolean",
  "Int",
  "BigInt",
  "Float",
  "Decimal",
  "DateTime",
  "Json",
  "Bytes",
  "Unsupported",
] as const;

const parseLine = (line: string): Line => {
  let match: RegExpMatchArray | null;
  if ((match = line.match(FieldLine.LINE_REGEX)) !== null) {
    return new FieldLine(match);
  }
  if ((match = line.match(MapLine.LINE_REGEX)) !== null) {
    return new MapLine(match);
  }
  if ((match = line.match(IdLine.LINE_REGEX)) !== null) {
    return new IdLine(match);
  }
  if ((match = line.match(UniqueLine.LINE_REGEX)) !== null) {
    return new UniqueLine(match);
  }
  if ((match = line.match(IndexLine.LINE_REGEX)) !== null) {
    return new IndexLine(match);
  }
  return new OtherLine(line);
};

interface Line {
  toString(): string;
}

class StartLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>model\s+)(?<name>[a-zA-Z]\w*)(?<after>\s*{.*)$/;

  private readonly before: string;
  modelName: string;
  private readonly after: string;

  constructor(line: string) {
    const matched = line.match(StartLine.LINE_REGEX);
    if (matched === null) {
      throw new Error("Invalid model name line");
    }
    this.before = matched.groups!.before;
    this.modelName = matched.groups!.name;
    this.after = matched.groups!.after;
  }

  toString(): string {
    return `${this.before}${this.modelName}${this.after}`;
  }
}

class FieldLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+)(?<name>[a-zA-Z]\w*)(?<space1>\s+)(?<type>(Unsupported\("[^"]+"\)(\[\]|\?|))|([a-zA-Z]\w*(\[\])?\??))((?<space2>\s+)((?<other>.+\s+)?(?<map>@map\("\w+"\))|(?<relation>@relation\([^)]+\))))?(?<after>.*)$/;

  readonly lineItems: FieldLineItem[] = [];

  constructor(match: RegExpMatchArray) {
    this.lineItems.push(new OtherItem(match.groups!.before));
    this.lineItems.push(new FieldNameItem(match.groups!.name));
    this.lineItems.push(new OtherItem(match.groups!.space1));
    this.lineItems.push(new FieldTypeItem(match.groups!.type));

    if (match.groups!.space2 !== undefined) {
      this.lineItems.push(new OtherItem(match.groups!.space2));
    }
    if (match.groups!.other !== undefined) {
      this.lineItems.push(new OtherItem(match.groups!.other));
    }
    if (match.groups!.map !== undefined) {
      this.lineItems.push(new MapItem(match.groups!.map));
    }
    if (match.groups!.relation !== undefined) {
      this.lineItems.push(new RelationItem(match.groups!.relation));
    }
    if (match.groups!.after !== undefined) {
      this.lineItems.push(new OtherItem(match.groups!.after));
    }
  }

  toString(): string {
    return this.lineItems.map((item) => item.toString()).join("");
  }

  getFieldName(): string {
    return (this.lineItems[1] as FieldNameItem).fileName;
  }
  setFieldName(name: string): void {
    (this.lineItems[1] as FieldNameItem).fileName = name;
  }

  getFieldType(): string {
    return (this.lineItems[3] as FieldTypeItem).fileType;
  }
  setFieldType(type: string): void {
    (this.lineItems[3] as FieldTypeItem).fileType = type;
  }
  getTrimedFieldType(): string {
    return this.getFieldType()
      .replace(/\(".*?"\)/, "")
      .replace("[]", "")
      .replace("?", "");
  }
  isArrayType(): boolean {
    return this.getFieldType().includes("[]");
  }

  getMap(): string | undefined {
    const mapItem = this.lineItems.find(
      (item): item is MapItem => item instanceof MapItem,
    );
    return mapItem?.map;
  }
  setMap(map: string | undefined): void {
    let mapItem = this.lineItems.find(
      (item): item is MapItem => item instanceof MapItem,
    );
    if (mapItem === undefined) {
      if (map === undefined) {
        return;
      }
      mapItem = new MapItem();

      // insert map item after the field type
      this.lineItems.splice(
        4,
        0,
        new OtherItem(" "),
        mapItem,
        new OtherItem(" "),
      );
    }
    mapItem.map = map;
  }

  getRelationFields(): string[] | undefined {
    const relationItem = this.lineItems.find(
      (item): item is RelationItem => item instanceof RelationItem,
    );
    return relationItem?.fields;
  }
  setRelationFields(fields: string[]): void {
    const relationItem = this.lineItems.find(
      (item): item is RelationItem => item instanceof RelationItem,
    );
    if (relationItem === undefined) {
      throw new Error("Relation item not found");
    }
    relationItem.fields = fields;
  }

  getRelationReferences(): string[] | undefined {
    const relationItem = this.lineItems.find(
      (item): item is RelationItem => item instanceof RelationItem,
    );
    return relationItem?.references;
  }
  setRelationReferences(references: string[]): void {
    const relationItem = this.lineItems.find(
      (item): item is RelationItem => item instanceof RelationItem,
    );
    if (relationItem === undefined) {
      throw new Error("Relation item not found");
    }
    relationItem.references = references;
  }
}

class MapLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+)(?<map>@@map\("\w+"\))(?<after>.*)$/;
  private static readonly MAP_PREFIX = '@@map("';
  private static readonly MAP_SUFFIX = '")';

  private readonly before: string;
  map: string | undefined;
  private readonly after: string;

  constructor(match?: RegExpMatchArray | undefined) {
    if (match === undefined) {
      this.before = "  ";
      this.map = undefined;
      this.after = "";
    } else {
      this.before = match.groups!.before;
      this.map = match.groups!.map.substring(
        MapLine.MAP_PREFIX.length,
        match.groups!.map.length - MapLine.MAP_SUFFIX.length,
      );
      this.after = match.groups!.after;
    }
  }
  toString(): string {
    return (
      this.before +
      (this.map !== undefined
        ? `${MapLine.MAP_PREFIX}${this.map}${MapLine.MAP_SUFFIX}`
        : "") +
      this.after
    );
  }
}

class IdLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+@@id\(\[)(?<fields>[^[]+)(?<after>\]\).*)$/;

  private readonly before: string;
  fields: string[];
  private readonly after: string;

  constructor(match: RegExpMatchArray) {
    this.before = match.groups!.before;
    this.fields = match.groups!.fields.split(",").map((field) => field.trim());
    this.after = match.groups!.after;
  }
  toString(): string {
    return `${this.before}${this.fields.join(", ")}${this.after}`;
  }
}

class UniqueLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+@@unique\(\[)(?<fields>[^[]+)(?<after>\]\).*)$/;

  private readonly before: string;
  fields: string[];
  private readonly after: string;

  constructor(match: RegExpMatchArray) {
    this.before = match.groups!.before;
    this.fields = match.groups!.fields.split(",").map((field) => field.trim());
    this.after = match.groups!.after;
  }
  toString(): string {
    return `${this.before}${this.fields.join(", ")}${this.after}`;
  }
}

class IndexLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+@@index\(\[)(?<fields>[^[]+)(?<after>\]\).*)$/;

  private readonly before: string;
  fields: string[];
  private readonly after: string;

  constructor(match: RegExpMatchArray) {
    this.before = match.groups!.before;
    this.fields = match.groups!.fields.split(",").map((field) => field.trim());
    this.after = match.groups!.after;
  }
  toString(): string {
    return `${this.before}${this.fields.join(", ")}${this.after}`;
  }
}

class OtherLine implements Line {
  constructor(private readonly line: string) {}
  toString(): string {
    return this.line;
  }
}

// ----------------------------------------
// FieldLineItem
// ----------------------------------------
interface FieldLineItem {
  toString(): string;
}

class FieldNameItem implements FieldLineItem {
  fileName: string;
  constructor(item: string) {
    this.fileName = item;
  }
  toString(): string {
    return this.fileName;
  }
}

class FieldTypeItem implements FieldLineItem {
  fileType: string;
  constructor(item: string) {
    this.fileType = item;
  }
  toString(): string {
    return this.fileType;
  }
}

class MapItem implements FieldLineItem {
  private static readonly MAP_PREFIX = '@map("';
  private static readonly MAP_SUFFIX = '")';

  map: string | undefined;

  constructor(item?: string | undefined) {
    if (item === undefined) {
      this.map = undefined;
    } else {
      this.map = item.substring(
        MapItem.MAP_PREFIX.length,
        item.length - MapItem.MAP_SUFFIX.length,
      );
    }
  }
  toString(): string {
    return this.map !== undefined
      ? `${MapItem.MAP_PREFIX}${this.map}${MapItem.MAP_SUFFIX}`
      : "";
  }
}
class RelationItem implements FieldLineItem {
  private static readonly FIELDS_REGEX =
    /^(?<before>.+fields: \[)(?<fields>[^\]]+)(?<after>\].*)$/;
  private static readonly REFERENCES_REGEX =
    /^(?<before>.+references: \[)(?<references>[^\]]+)(?<after>\].*)$/;
  private static readonly FIELDS_PLACEHOLDER = "${fields}";
  private static readonly REFERENCES_PLACEHOLDER = "${references}";

  template: string;
  fields: string[] = [];
  references: string[] = [];

  constructor(item: string) {
    const matchedFields = item.match(RelationItem.FIELDS_REGEX);
    if (matchedFields !== null) {
      item =
        matchedFields.groups!.before +
        RelationItem.FIELDS_PLACEHOLDER +
        matchedFields.groups!.after;
      this.fields = matchedFields
        .groups!.fields.split(",")
        .map((field) => field.trim());
    }

    const matchedReferences = item.match(RelationItem.REFERENCES_REGEX);
    if (matchedReferences !== null) {
      item =
        matchedReferences.groups!.before +
        RelationItem.REFERENCES_PLACEHOLDER +
        matchedReferences.groups!.after;
      this.references = matchedReferences
        .groups!.references.split(",")
        .map((reference) => reference.trim());
    }

    this.template = item;
  }
  toString(): string {
    return this.template
      .replace(RelationItem.FIELDS_PLACEHOLDER, this.fields.join(", "))
      .replace(RelationItem.REFERENCES_PLACEHOLDER, this.references.join(", "));
  }
}

class OtherItem implements FieldLineItem {
  constructor(private readonly item: string) {}
  toString(): string {
    return this.item;
  }
}
