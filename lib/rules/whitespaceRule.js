var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_BRANCH = "check-branch";
var OPTION_DECL = "check-decl";
var OPTION_OPERATOR = "check-operator";
var OPTION_SEPARATOR = "check-separator";
var OPTION_TYPE = "check-type";

var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (syntaxTree) {
        return this.applyWithWalker(new WhitespaceWalker(syntaxTree, this.getOptions()));
    };
    Rule.FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;

var WhitespaceWalker = (function (_super) {
    __extends(WhitespaceWalker, _super);
    function WhitespaceWalker() {
        _super.apply(this, arguments);
    }
    WhitespaceWalker.prototype.visitToken = function (token) {
        _super.prototype.visitToken.call(this, token);

        var kind = token.kind();
        if ((this.hasOption(OPTION_BRANCH) && this.isBranchKind(kind)) || (this.hasOption(OPTION_SEPARATOR) && this.isSeparatorKind(kind)) || (this.hasOption(OPTION_DECL) && kind === TypeScript.SyntaxKind.EqualsToken) || (this.hasOption(OPTION_TYPE) && kind === TypeScript.SyntaxKind.ColonToken)) {
            this.checkForLeadingSpace(this.position(), token.trailingTrivia());
        }
    };

    WhitespaceWalker.prototype.visitBinaryExpression = function (node) {
        var operator = node.operatorToken;
        if (this.hasOption(OPTION_OPERATOR) && operator.kind() !== TypeScript.SyntaxKind.CommaToken) {
            var position = this.positionAfter(node.left);
            this.checkForLeadingSpace(position, node.left.trailingTrivia());

            position += operator.fullWidth();
            this.checkForLeadingSpace(position, operator.trailingTrivia());
        }

        _super.prototype.visitBinaryExpression.call(this, node);
    };

    WhitespaceWalker.prototype.visitConditionalExpression = function (node) {
        if (this.hasOption(OPTION_OPERATOR)) {
            var position = this.positionAfter(node.condition);
            this.checkForLeadingSpace(position, node.condition.trailingTrivia());

            position += node.questionToken.fullWidth();
            this.checkForLeadingSpace(position, node.questionToken.trailingTrivia());

            position += node.whenTrue.fullWidth();
            this.checkForLeadingSpace(position, node.whenTrue.trailingTrivia());
        }

        _super.prototype.visitConditionalExpression.call(this, node);
    };

    WhitespaceWalker.prototype.visitVariableDeclarator = function (node) {
        var position = this.positionAfter(node.identifier, node.typeAnnotation);

        if (this.hasOption(OPTION_DECL) && node.equalsValueClause !== null) {
            if (node.typeAnnotation !== null) {
                this.checkForLeadingSpace(position, node.typeAnnotation.trailingTrivia());
            } else {
                this.checkForLeadingSpace(position, node.identifier.trailingTrivia());
            }
        }

        _super.prototype.visitVariableDeclarator.call(this, node);
    };

    WhitespaceWalker.prototype.visitImportDeclaration = function (node) {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.importKeyword, node.identifier);
            this.checkForLeadingSpace(position, node.identifier.trailingTrivia());
        }

        _super.prototype.visitImportDeclaration.call(this, node);
    };

    WhitespaceWalker.prototype.visitExportAssignment = function (node) {
        if (this.hasOption(OPTION_DECL)) {
            var position = this.positionAfter(node.exportKeyword);
            this.checkForLeadingSpace(position, node.exportKeyword.trailingTrivia());
        }

        _super.prototype.visitExportAssignment.call(this, node);
    };

    WhitespaceWalker.prototype.isBranchKind = function (kind) {
        return (kind === TypeScript.SyntaxKind.CatchKeyword || kind === TypeScript.SyntaxKind.ForKeyword || kind === TypeScript.SyntaxKind.IfKeyword || kind === TypeScript.SyntaxKind.SwitchKeyword || kind === TypeScript.SyntaxKind.WhileKeyword || kind === TypeScript.SyntaxKind.WithKeyword);
    };

    WhitespaceWalker.prototype.isSeparatorKind = function (kind) {
        return (kind === TypeScript.SyntaxKind.CommaToken || kind === TypeScript.SyntaxKind.SemicolonToken);
    };

    WhitespaceWalker.prototype.checkForLeadingSpace = function (position, trivia) {
        var failure = null;

        if (trivia.count() < 1) {
            failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
        } else {
            var kind = trivia.syntaxTriviaAt(0).kind();
            if (kind !== TypeScript.SyntaxKind.WhitespaceTrivia && kind !== TypeScript.SyntaxKind.NewLineTrivia) {
                failure = this.createFailure(position, 1, Rule.FAILURE_STRING);
            }
        }

        if (failure) {
            this.addFailure(failure);
        }
    };
    return WhitespaceWalker;
})(Lint.RuleWalker);

