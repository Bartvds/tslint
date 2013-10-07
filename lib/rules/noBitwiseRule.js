var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new NoBitwiseWalker(syntaxTree));
    };
    Rule.FAILURE_STRING = "forbidden bitwise operation";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var NoBitwiseWalker = (function (_super) {
    __extends(NoBitwiseWalker, _super);
    function NoBitwiseWalker() {
        _super.apply(this, arguments);
    }
    NoBitwiseWalker.prototype.visitNode = function (node) {
        if (node.kind() === TypeScript.SyntaxKind.BitwiseAndExpression || node.kind() === TypeScript.SyntaxKind.AndAssignmentExpression || node.kind() === TypeScript.SyntaxKind.BitwiseOrExpression || node.kind() === TypeScript.SyntaxKind.OrAssignmentExpression || node.kind() === TypeScript.SyntaxKind.BitwiseExclusiveOrExpression || node.kind() === TypeScript.SyntaxKind.ExclusiveOrAssignmentExpression || node.kind() === TypeScript.SyntaxKind.LeftShiftExpression || node.kind() === TypeScript.SyntaxKind.LeftShiftAssignmentExpression || node.kind() === TypeScript.SyntaxKind.SignedRightShiftExpression || node.kind() === TypeScript.SyntaxKind.SignedRightShiftAssignmentExpression || node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftExpression || node.kind() === TypeScript.SyntaxKind.UnsignedRightShiftAssignmentExpression || node.kind() === TypeScript.SyntaxKind.BitwiseNotExpression) {
            this.addFailure(this.createFailure(this.position() + node.leadingTriviaWidth(), node.width(), Rule.FAILURE_STRING));
        }

        _super.prototype.visitNode.call(this, node);
    };
    return NoBitwiseWalker;
})(Lint.RuleWalker);

